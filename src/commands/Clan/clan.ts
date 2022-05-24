import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import type { Clan } from 'clashofclans.js';
import { MessageEmbed } from 'discord.js';

import { embedBuilder } from '#lib/classes/embeds';
import { BlueNumberEmotes, clanHelper, LabelEmotes, MiscEmotes, RawClanType, RawWarFrequency, TownHallEmotes, WarLeagueEmotes } from '#lib/coc';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors, Emotes } from '#utils/constants';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get info about a clan'
})
export class ClanCommand extends GoblinCommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('tag')
							.setDescription('Tag of the clan')
							.setRequired(false)
							.setAutocomplete(true)
					),
			{ idHints: ['975586954982867024'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();

		const clan = await clanHelper.info(interaction.options.getString('tag', true));

		if (clan.memberCount === 0) {
			return interaction.editReply({ embeds: [embedBuilder.error('Clan has 0 members, failed to collect the required data')] });
		}
		const infoEmbed = ClanCommand.infoEmbed(clan);

		await interaction.editReply({ embeds: [infoEmbed] });
		return this.clanComposition(interaction, infoEmbed, clan);
	}

	private async clanComposition(interaction: ChatInputCommand.Interaction<'cached'>, embed: MessageEmbed, clan: Clan) {
		const composition: Record<number, number> = {};
		const members = await clan.fetchMembers().then((data) => data.sort());
		for (const member of members) {
			if (!composition.hasOwnProperty(member.townHallLevel)) {
				composition[member.townHallLevel] = 0;
			}

			composition[member.townHallLevel]++;
		}

		const sortedCompo = Object.entries(composition).sort((one, two) => Number(two[0]) - Number(one[0]));

		let formattedComposition = '**Clan Composition**\n';
		for (const count of sortedCompo) {
			formattedComposition += `${TownHallEmotes[count[0]]} ${BlueNumberEmotes[count[1]]}\n`;
		}

		// remove placeholder field for composition fetch
		embed.spliceFields(2, 1);
		embed.addField('\u200B', formattedComposition, false);
		return interaction.editReply({ embeds: [embed] });
	}

	private static infoEmbed(clan: Clan) {
		let description = '';
		let infoField = '';

		description += `${MiscEmotes.HomeTrophy} **${clan.points}** ${MiscEmotes.BuilderTrophy} **${clan.versusPoints}** ${MiscEmotes.Members} **${clan.memberCount}**\n\n`;
		description += clan.description ? `${clan.description}` : 'No description set';
		clan.labels.length && (description += `\n\n${clan.labels.map((label) => [`${LabelEmotes[label.name]} ${label.name}`]).join('\n')}\n\n`);

		infoField += `**Leader**\n${MiscEmotes['Leader']} ${clan.members.find((member) => member.role === 'leader')!.name}\n`;
		infoField += clan.location
			? `**Location**\n:${clan.location?.countryCode ? `flag_${clan.location?.countryCode?.toLowerCase()}` : 'globe_with_meridians'}: ${
					clan.location.name
			  }\n`
			: '`Not set\n`';
		infoField += `🚪 ${RawClanType[clan.type]} ${MiscEmotes.HomeTrophy} ${clan.requiredTrophies}+ ${
			TownHallEmotes[clan.requiredTownHallLevel ?? 1]
		} ${clan.requiredTownHallLevel}`;

		return new MessageEmbed()
			.setTitle(clan.name)
			.setURL(clan.shareLink)
			.setDescription(description)
			.addFields(
				{
					name: '\u200B',
					value: infoField,
					inline: false
				},
				{
					name: '\u200B',
					value: `**War Stats**\n${MiscEmotes.Win} ${clan.warWins} Won ${MiscEmotes.Lose} ${clan.warLosses} Lost ${MiscEmotes.Draw} ${
						clan.warTies
					} Tied\n**Win Streak**\n${MiscEmotes.Streak} ${clan.warWinStreak}\n**War Frequency**\n${
						RawWarFrequency[clan.warFrequency]
					}\n**War League**\n${WarLeagueEmotes[clan.warLeague!.name]} ${clan.warLeague!.name}`,
					inline: false
				},
				{
					name: 'Clan Composition',
					value: `${Emotes.Typing} Fetching clan composition...`,
					inline: false
				}
			)
			.setThumbnail(clan.badge.medium)
			.setColor(Colors.Blue)
			.setTimestamp();
	}
}
