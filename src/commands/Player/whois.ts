import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { Util } from 'clashofclans.js';
import { EmbedBuilder, bold } from 'discord.js';

import { MiscEmotes, PlayerUnits, RawPosition, TownHallEmotes } from '#lib/coc';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { PlayerCommand } from '#root/commands/Player/player';
import { Colors } from '#utils/constants';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get information about an user'
})
export class WhoIsCommand extends GoblinCommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) =>
						option //
							.setName('user')
							.setDescription('The user to get information for')
							.setRequired(false)
					),
			{ idHints: ['974749593696874506', '980131954139734138'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		const member = interaction.options.getMember('user') || interaction.member;

		const data = await this.coc.linkApi.getLinks(member.id);
		if (isNullish(data)) {
			return interaction.editReply({ content: "Can't find any account linked for your profile." });
		}

		const overall = { stars: 0, donations: 0, received: 0, attacks: 0, defenses: 0 };
		const players = await Util.allSettled(data.splice(0, 5).map((tag) => this.coc.getPlayer(tag)));

		const firstPage = new EmbedBuilder()
			.setAuthor({ name: `${member.user.username} (${member.id})` })
			.setThumbnail(member.displayAvatarURL({ extension: 'png', size: 128, forceStatic: true }))
			.setColor(Colors.Indigo)
			.setTimestamp();
		const pages = [];

		for (const player of players) {
			overall.stars += player.warStars;
			overall.donations += player.donations;
			overall.received += player.received;
			overall.attacks += player.attackWins;
			overall.defenses += player.defenseWins;

			firstPage.setDescription(
				`${bold('Overall Stats')}\n${MiscEmotes.WarStars} War Stars: ${overall.stars}\n${MiscEmotes.Out} Troops Donated: ${
					overall.donations
				}\n${MiscEmotes.In} Troops Received: ${overall.received}\n${MiscEmotes.Sword} Attacks: ${overall.attacks}\n${
					MiscEmotes.Shield
				} Defenses: ${overall.defenses}`
			);

			const units = new PlayerUnits(player);
			firstPage.addFields([
				{
					name: `<:dot:843249351291043851> ${TownHallEmotes[player.townHallLevel]} ${player.name} (${player.tag})`,
					value: `${MiscEmotes.Clan} ${player.clan ? `${player.clan.name} (${RawPosition[player.role!]})` : 'Not in a clan'}\n${units.unit(
						'HEROES'
					)}`,
					inline: false
				}
			]);

			const infoEmbed = PlayerCommand.unitsEmbed(player, ['Builder Troops', 'Heroes'])
				.setTitle(`${player.name} (${player.tag})`)
				.setURL(player.shareLink)
				.setDescription(
					`${MiscEmotes.Exp} ${player.expLevel} ${MiscEmotes.HomeTrophy} ${player.trophies} ${MiscEmotes.WarStars} ${player.warStars}`
				)
				.setThumbnail(
					`https://clash-assets.vercel.app/townhalls/${
						player.townHallWeaponLevel ? `${player.townHallLevel}.${player.townHallWeaponLevel}` : `${player.townHallLevel}`
					}.png`
				);
			pages.push(infoEmbed);
		}

		const paginator = new PaginatedMessage({ template: new EmbedBuilder().setColor(Colors.Indigo) });
		paginator.addPageEmbed(firstPage);
		pages.map((page) => paginator.addPageEmbed(page));
		return paginator.run(interaction);
	}
}
