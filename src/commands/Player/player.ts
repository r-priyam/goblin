import { bold } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Achievement, Player } from 'clashofclans.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { GoblinPlayer, LabelEmotes, MiscEmotes, RawPosition } from '#lib/coc';
import { Colors } from '#utils/constants';
import { collectorFiler } from '#utils/InteractionHelpers';
import { ClanOrPlayer, redis } from '#utils/redis';
import { humanizeNumber } from '#utils/utils';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get info about a player'
})
export class PlayerCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('tag')
							.setDescription('Tag of the player')
							.setRequired(false)
							.setAutocomplete(true)
					)
					.setDMPermission(false),
			{ idHints: ['977007152600350761', '980131956241092648'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		const message = await interaction.deferReply({ fetchReply: true });
		let playerTag = interaction.options.getString('tag');

		if (isNullish(playerTag)) {
			const cachedPlayers = await redis.get<ClanOrPlayer[]>(`p-${interaction.user.id}`);
			if (isNullish(cachedPlayers)) {
				await interaction.editReply({
					content:
						'You have no player linked into your profile. Please link any player or provide the tag as 2nd argument!'
				});
				return;
			}

			playerTag = cachedPlayers[0].tag;
		}

		const player = await this.coc.playerHelper.info(playerTag);
		const infoEmbed = PlayerCommand.infoEmbed(player);
		const unitsEmbed = PlayerCommand.unitsEmbed(player);
		await interaction.editReply({ embeds: [infoEmbed], components: [PlayerCommand.components] });

		const collector = message.channel.createMessageComponentCollector({
			componentType: 'BUTTON',
			filter: (interaction) => collectorFiler(interaction, interaction.user.id, message.id),
			time: Time.Minute * 2
		});

		collector.on('collect', async (buttonInteraction) => {
			if (buttonInteraction.customId.includes('PLAYER_INFO')) {
				return buttonInteraction.update({ embeds: [infoEmbed] });
			}

			return buttonInteraction.update({ embeds: [unitsEmbed] });
		});

		collector.on('end', async () => void (await interaction.editReply({ components: [] }).catch(() => null)));
	}

	public static unitsEmbed(player: GoblinPlayer, filterFields = ['']) {
		const { units } = player;
		const fields = [
			{ name: 'Elixir Troops', value: units.unit('ELIXIR') },
			{ name: 'Dark Troops', value: units.unit('DARK') },
			{ name: 'Spells', value: units.unit('SPELLS') },
			{ name: 'Siege Machines', value: units.unit('SIEGE') },
			{ name: 'Heroes Pets', value: units.unit('PETS') },
			{ name: 'Builder Troops', value: units.unit('BUILDER') },
			{ name: 'Heroes', value: units.unit('HEROES') },
			{ name: 'Super Troops', value: units.unit('SUPER') }
		];

		const embed = new MessageEmbed() //
			.setTitle(`Units for ${player.name}`)
			.setColor(Colors.Indigo);

		for (const field of fields) {
			if (filterFields.includes(field.name) || isNullishOrEmpty(field.value)) {
				continue;
			}

			embed.addField(field.name, field.value, false);
		}

		return embed;
	}

	private static get components() {
		return new MessageActionRow() //
			.addComponents([
				new MessageButton() //
					.setCustomId(`PLAYER_INFO$_${Date.now()}`)
					.setStyle('SECONDARY')
					.setLabel('Info')
					.setEmoji(MiscEmotes.Info),
				new MessageButton() //
					.setCustomId(`PLAYER_UNITS_${Date.now()}`)
					.setStyle('SECONDARY')
					.setLabel('Units')
					.setEmoji(LabelEmotes.Underdog)
			]);
	}

	private static infoEmbed(player: Player) {
		const townHallThumbnail = `https://clash-assets.vercel.app/townhalls/${
			player.townHallWeaponLevel
				? `${player.townHallLevel}.${player.townHallWeaponLevel}`
				: `${player.townHallLevel}`
		}.png`;

		let description = '';

		description += `${MiscEmotes.Exp} ${player.expLevel} ${MiscEmotes.HomeTrophy} ${player.trophies} ${MiscEmotes.WarStars} ${player.warStars}`;
		if (player.clan)
			description += `\n\n${MiscEmotes.Clan} [${player.clan.name}](${player.clan.shareLink}) (${
				RawPosition[player.role!]
			})`;

		const seasonStats = `${bold('Season Stats')}\n${bold('Troops donated')}\n${MiscEmotes.TroopDonations} ${
			player.donations
		} ${MiscEmotes.In}\n${bold('Troops received')}\n${MiscEmotes.TroopDonations} ${player.received} ${
			MiscEmotes.Out
		}\n${bold('Attacks won')}\n${MiscEmotes.Sword} ${player.attackWins}\n${bold('Defenses won')}\n${
			MiscEmotes.Shield
		} ${player.defenseWins}`;

		return new MessageEmbed()
			.setTitle(player.name)
			.setURL(player.shareLink)
			.setDescription(description)
			.addField('\u200B', seasonStats, false)
			.addField('\u200B', PlayerCommand.getAchievementsValue(player.achievements), false)
			.setThumbnail(townHallThumbnail)
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
			{ name: bold('Troops Donated'), value: `${MiscEmotes.TroopDonations} ${getAchievement('Friend in Need')}` },
			{
				name: bold('Spells Donated'),
				value: `${MiscEmotes.SpellDonations} ${getAchievement('Sharing is caring')}`
			},
			{ name: bold('Siege Donated'), value: `${MiscEmotes.SiegeDonations} ${getAchievement('Siege Sharer')}` },
			{
				name: bold('Attacks Won'),
				value: `${MiscEmotes.Sword} ${getAchievement('Sweet Victory!')}`
			},
			{ name: bold('Defense Won'), value: `${MiscEmotes.Shield} ${getAchievement('Unbreakable')}` },
			{
				name: bold('CWL War Stars'),
				value: `${MiscEmotes.GoldStar} ${getAchievement('War League Legend')}`
			},
			{ name: bold('Clan Games Points'), value: `${MiscEmotes.ClanGames} ${getAchievement('Games Champion')}` },
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
