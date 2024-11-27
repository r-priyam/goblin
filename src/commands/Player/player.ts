import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Achievement } from 'clashofclans.js';
import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	bold,
	ComponentType,
	ButtonStyle,
	userMention
} from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { GoblinPlayer } from '#lib/coc';
import { LabelEmotes, MiscEmotes, RawPosition } from '#lib/coc';
import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { collectorFiler } from '#utils/InteractionHelpers';
import { Colors } from '#utils/constants';
import { playerTagOption } from '#utils/functions/commandOptions';
import { humanizeNumber } from '#utils/utils';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('player')
			.setDescription('Get info about a player')
			.addStringOption((option) => playerTagOption(option, { autoComplete: true })),
	commandMetaOptions: { idHints: ['977007152600350761', '980131956241092648'] }
})
export class PlayerCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		const message = await interaction.deferReply({ fetchReply: true });

		const playerTag = await this.coc.playerHelper.dynamicTag(interaction);
		const player = await this.coc.playerHelper.info(interaction, playerTag);

		const infoEmbed = await this.infoEmbed(player);
		const unitsEmbed = PlayerCommand.unitsEmbed(player);
		await interaction.editReply({
			embeds: [infoEmbed],
			components: [PlayerCommand.components]
		});

		const authorId = interaction.user.id;
		const collector = message.channel.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: async (interaction) => collectorFiler(interaction, authorId, message.id),
			time: Time.Minute * 2
		});

		collector.on('collect', async (buttonInteraction) => {
			if (buttonInteraction.customId.includes('PLAYER_INFO')) {
				await buttonInteraction.update({ embeds: [infoEmbed] });
			}

			await buttonInteraction.update({ embeds: [unitsEmbed] });
		});

		collector.on('end', async () => void (await interaction.editReply({ components: [] }).catch(() => null)));
	}

	public static unitsEmbed(player: GoblinPlayer, filterFields = ['']) {
		const { units, name, townHallImage, shareLink } = player;
		const possibleFields = [
			{ name: 'Elixir Troops', value: units.unit('ELIXIR') },
			{ name: 'Dark Troops', value: units.unit('DARK') },
			{ name: 'Spells', value: units.unit('SPELLS') },
			{ name: 'Siege Machines', value: units.unit('SIEGE') },
			{ name: 'Hero Pets', value: units.unit('PETS') },
			{ name: 'Builder Troops', value: units.unit('BUILDER') },
			{ name: 'Heroes', value: units.unit('HEROES') },
			{ name: 'Equipment', value: units.unit('EQUIPMENT') },
			{ name: 'Super Troops', value: units.unit('SUPER') }
		];

		const embed = new EmbedBuilder() //
			.setAuthor({
				name: `Units for ${name}`,
				iconURL: townHallImage,
				url: shareLink
			})
			.setColor(Colors.Indigo);

		for (const field of possibleFields) {
			if (filterFields.includes(field.name) || isNullishOrEmpty(field.value)) {
				continue;
			}

			for (const [index, chunk] of field.value.entries()) {
				embed.addFields({ name: index === 0 ? field.name : `\u200B`, value: chunk, inline: false });
			}
		}

		return embed;
	}

	private static get components() {
		return new ActionRowBuilder<ButtonBuilder>() //
			.addComponents([
				new ButtonBuilder() //
					.setCustomId(`PLAYER_INFO$_${Date.now()}`)
					.setStyle(ButtonStyle.Secondary)
					.setLabel('Info')
					.setEmoji(MiscEmotes.Info),
				new ButtonBuilder() //
					.setCustomId(`PLAYER_UNITS_${Date.now()}`)
					.setStyle(ButtonStyle.Secondary)
					.setLabel('Units')
					.setEmoji(LabelEmotes.Underdog)
			]);
	}

	private async infoEmbed(player: GoblinPlayer) {
		let description = '';

		description += `${MiscEmotes.Exp} ${player.expLevel} ${MiscEmotes.HomeTrophy} ${player.trophies} ${MiscEmotes.WarStars} ${player.warStars}`;
		if (player.clan) {
			description += `\n\n${MiscEmotes.Clan} [${player.clan.name}](${player.clan.shareLink}) (${
				RawPosition[player.role!]
			})`;
		}

		const seasonStats = `${bold('Season Stats')}\n${bold('Troops donated')}\n${MiscEmotes.TroopDonations} ${
			player.donations
		} ${MiscEmotes.In}\n${bold('Troops received')}\n${MiscEmotes.TroopDonations} ${player.received} ${
			MiscEmotes.Out
		}\n${bold('Attacks won')}\n${MiscEmotes.Sword} ${player.attackWins}\n${bold('Defenses won')}\n${
			MiscEmotes.Shield
		} ${player.defenseWins}`;

		const linkedData = await this.sql<
			{ userId: string }[]
		>`SELECT user_id FROM players WHERE player_tag = ${player.tag}`;

		let linkedValue = '';
		if (isNullishOrEmpty(linkedData)) {
			linkedValue = 'Not linked to any user';
		} else {
			linkedValue = linkedData.map((data) => userMention(data.userId)).join('\n');
		}

		return new EmbedBuilder()
			.setTitle(player.name)
			.setURL(player.shareLink)
			.setDescription(description)
			.addFields(
				{ name: 'Link Info', value: linkedValue, inline: false },
				{ name: '\u200B', value: seasonStats, inline: false },
				{
					name: '\u200B',
					value: PlayerCommand.getAchievementsValue(player.achievements),
					inline: false
				}
			)
			.setThumbnail(player.townHallImage)
			.setFooter({ text: player.league.name, iconURL: player.league.icon.url })
			.setColor(Colors.Indigo);
	}

	private static getAchievementsValue(data: Achievement[]) {
		const getAchievement = (name: string) => data.find((achievement) => achievement.name === name)!.value;

		const achievements = [
			{
				name: bold('Total Loots'),
				value: `${MiscEmotes.Gold} ${humanizeNumber(getAchievement('Gold Grab'))} ${
					MiscEmotes.Elixir
				} ${humanizeNumber(getAchievement('Elixir Escapade'))} ${MiscEmotes.Dark} ${humanizeNumber(
					getAchievement('Heroic Heist')
				)}`
			},
			{
				name: bold('Troops Donated'),
				value: `${MiscEmotes.TroopDonations} ${getAchievement('Friend in Need')}`
			},
			{
				name: bold('Spells Donated'),
				value: `${MiscEmotes.SpellDonations} ${getAchievement('Sharing is caring')}`
			},
			{
				name: bold('Siege Donated'),
				value: `${MiscEmotes.SiegeDonations} ${getAchievement('Siege Sharer')}`
			},
			{
				name: bold('Attacks Won'),
				value: `${MiscEmotes.Sword} ${getAchievement('Sweet Victory!')}`
			},
			{
				name: bold('Defense Won'),
				value: `${MiscEmotes.Shield} ${getAchievement('Unbreakable')}`
			},
			{
				name: bold('CWL War Stars'),
				value: `${MiscEmotes.GoldStar} ${getAchievement('War League Legend')}`
			},
			{
				name: bold('Clan Games Points'),
				value: `${MiscEmotes.ClanGames} ${getAchievement('Games Champion')}`
			},
			{
				name: bold('Capital Gold Looted'),
				value: `${MiscEmotes.ClanGold} ${getAchievement('Aggressive Capitalism')}`
			},
			{
				name: bold('Capital Gold Contributed'),
				value: `${MiscEmotes.ClanGold} ${getAchievement('Most Valuable Clanmate')}`
			}
		];

		let value = `${bold('Achievement Stats')}\n`;
		const last = achievements.pop()!;

		for (const achievement of achievements) {
			value += `${achievement.name}\n${achievement.value}\n`;
		}

		value += `${last.name}\n${last.value}\n`;

		return value;
	}
}
