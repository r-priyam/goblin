import { userMention } from '@discordjs/builders';
import { container, Result, UserError } from '@sapphire/framework';
import { Clan, HTTPError, Util } from 'clashofclans.js';
import { MessageEmbed } from 'discord.js';

import { BlueNumberEmotes, ErrorMessages, LabelEmotes, MiscEmotes, RawWarFrequency, TownHallEmotes, WarLeagueEmotes } from '#lib/coc';

class CocClanHelper {
	public async info(tag: string) {
		if (!Util.isValidTag(Util.formatTag(tag))) {
			throw new UserError({
				identifier: 'clan-wrong-tag',
				message: 'No clan found for the requested tag!'
			});
		}

		const clan = await Result.fromAsync(() => container.coc.getClan(tag));
		return clan.unwrapOrElse((error) => {
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: 'clan-info-request',
					message: error.status === 404 ? 'No clan found for the requested tag!' : ErrorMessages[error.status]
				});
			}

			throw error;
		});
	}

	public async getClanComposition(clan: Clan, formatComposition = false) {
		const composition: Record<number, number> = {};
		const members = await clan.fetchMembers();

		for (const member of members) {
			if (!composition.hasOwnProperty(member.townHallLevel)) composition[member.townHallLevel] = 0;
			composition[member.townHallLevel]++;
		}

		const sortedCompo = Object.entries(composition).sort((one, two) => Number(two[0]) - Number(one[0]));

		if (formatComposition) {
			let formattedComposition = '**Clan Composition**\n';
			for (const [townHallLevel, count] of sortedCompo) {
				formattedComposition += `${TownHallEmotes[townHallLevel]} ${BlueNumberEmotes[count]}\n`;
			}

			return formattedComposition;
		}

		return sortedCompo;
	}

	public async generateAutomationClanEmbed(
		clan: Clan,
		{ leaderId, requirements, color }: { leaderId: string; requirements: string; color: string }
	) {
		const composition = await this.getClanComposition(clan, true);

		return new MessageEmbed()
			.setTitle(clan.name)
			.setURL(clan.shareLink)
			.setDescription(
				`${MiscEmotes.HomeTrophy} **${clan.points}** ${MiscEmotes.BuilderTrophy} **${clan.versusPoints}** ${MiscEmotes.Members} **${
					clan.memberCount
				}**\n\n${clan.description ? `${clan.description}` : 'No description set'}`
			)
			.addFields(
				{
					name: '\u200B',
					value: `**Leader**
${MiscEmotes['Leader']} ${userMention(leaderId)} ${clan.members.find((member) => member.role === 'leader')!.name}`,
					inline: false
				},
				{
					name: '\u200B',
					value: `Clan Requirements\n${requirements}`,
					inline: false
				},
				{
					name: '\u200B',
					value: `**War Stats**
${MiscEmotes.Win} ${clan.warWins} Won ${MiscEmotes.Lose} ${clan.warLosses ?? 0} Lost ${MiscEmotes.Draw ?? 0} ${clan.warTies ?? 0} Tied
**Win Streak**\n${MiscEmotes.Streak} ${clan.warWinStreak}\n**War Frequency**
${RawWarFrequency[clan.warFrequency]}
**War League**
${WarLeagueEmotes[clan.warLeague!.name]} ${clan.warLeague!.name}`,
					inline: false
				},
				{
					name: '\u200B',
					// TODO: Send loading message here instead of delaying the output
					value: composition as string,
					inline: false
				},
				{
					name: '\u200B',
					value: `Clan Labels\n${
						clan.labels.length > 0
							? `${clan.labels.map((label) => [`${LabelEmotes[label.name]} ${label.name}`]).join('\n')}`
							: 'No Labels Set'
					}`,
					inline: false
				}
			)
			.setThumbnail(clan.badge.medium)
			.setTimestamp()
			.setColor(Number.parseInt(color.replace(/^#/, ''), 16))
			.setFooter({ text: 'Last Synced' });
	}
}

export const ClanHelper = new CocClanHelper();
