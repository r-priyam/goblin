import { bold } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { Util } from 'clashofclans.js';
import { MessageEmbed } from 'discord.js';
import { MiscEmotes, RawPosition, TownHallEmotes } from '#lib/coc';
import { PlayerCommand } from '#root/commands/Player/player';
import { Colors } from '#root/lib/util/constants';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get information about an user'
})
export class WhoIsCommand extends Command {
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
					)
					.setDMPermission(false),
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

		const firstPage = new MessageEmbed()
			.setAuthor({ name: `${member.user.username} (${member.id})` })
			.setThumbnail(member.displayAvatarURL({ size: 96, format: 'png', dynamic: true }))
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

			const { units, townHallLevel, name, tag, clan, role, expLevel, trophies, warStars, shareLink, townHallWeaponLevel } = player;
			firstPage.addField(
				`<:dot:958824443445116960> ${TownHallEmotes[townHallLevel]} ${name} (${tag})`,
				`${MiscEmotes.Clan} ${clan ? `${clan.name} (${RawPosition[role!]})` : 'Not in a clan'}\n${units.unit('HEROES')}`,
				false
			);

			const infoEmbed = PlayerCommand.unitsEmbed(player, ['Builder Troops', 'Heroes'])
				.setTitle(`${name} (${tag})`)
				.setURL(shareLink)
				.setDescription(`${MiscEmotes.Exp} ${expLevel} ${MiscEmotes.HomeTrophy} ${trophies} ${MiscEmotes.WarStars} ${warStars}`)
				.setThumbnail(
					`https://clash-assets.vercel.app/townhalls/${
						townHallWeaponLevel ? `${townHallLevel}.${townHallWeaponLevel}` : `${townHallLevel}`
					}.png`
				);
			pages.push(infoEmbed);
		}

		const paginator = new PaginatedMessage({ template: new MessageEmbed().setColor(Colors.Indigo) });
		paginator.addPageEmbed(firstPage);
		pages.map((page) => paginator.addPageEmbed(page));
		return paginator.run(interaction);
	}
}
