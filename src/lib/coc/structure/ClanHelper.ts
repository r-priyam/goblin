import { container, UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { HTTPError } from 'clashofclans.js';
import { bold, userMention, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

import type { Clan } from 'clashofclans.js';

import {
	BlueNumberEmotes,
	ErrorMessages,
	LabelEmotes,
	MiscEmotes,
	RawWarFrequency,
	TownHallEmotes,
	WarLeagueEmotes
} from '#lib/coc';
import { ValidateTag } from '#lib/decorators/ValidateTag';
import { ErrorIdentifiers } from '#utils/constants';

export class ClanHelper {
	@ValidateTag({ prefix: 'clan', isDynamic: true })
	public async info(_interaction: ChatInputCommandInteraction<'cached'>, tag: string) {
		const result = await Result.fromAsync(() => container.coc.getClan(tag));
		if (result.isErr()) {
			const error = result.unwrapErr();
			if (error instanceof HTTPError) {
				throw new UserError({
					identifier: ErrorIdentifiers.ClanHelper,
					message: error.status === 404 ? 'No clan found for the requested tag!' : ErrorMessages[error.status]
				});
			}

			throw error;
		}

		return result.unwrap();
	}

	public getClanComposition(clan: Clan, formatComposition = false) {
		const composition: Record<number, number> = {};

		for (const member of clan.members) {
			if (!Object.hasOwn(composition, member.townHallLevel)) {
				composition[member.townHallLevel] = 0;
			}

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
		{ leaderId, requirements, color }: { color: string; leaderId: string; requirements: string }
	) {
		return new EmbedBuilder()
			.setTitle(clan.name)
			.setURL(clan.shareLink)
			.setDescription(
				`${MiscEmotes.HomeTrophy} **${clan.points}** ${MiscEmotes.BuilderTrophy} **${clan.builderBasePoints}** ${
					MiscEmotes.Members
				} **${clan.memberCount}**\n\n${clan.description ? `${clan.description}` : 'No description set'}`
			)
			.addFields(
				{
					name: '\u200B',
					value: `**Leader**
${MiscEmotes.Leader} ${userMention(leaderId)} ${clan.members.find((member) => member.role === 'leader')!.name}`,
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
${MiscEmotes.Win} ${clan.warWins} Won ${MiscEmotes.Lose} ${clan.warLosses ?? 0} Lost ${MiscEmotes.Draw ?? 0} ${
						clan.warTies ?? 0
					} Tied
**Win Streak**\n${MiscEmotes.Streak} ${clan.warWinStreak}\n**War Frequency**
${RawWarFrequency[clan.warFrequency]}
**War League**
${WarLeagueEmotes[clan.warLeague!.name]} ${clan.warLeague!.name}`,
					inline: false
				},
				{
					name: '\u200B',
					value: this.getClanComposition(clan, true) as string,
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

	public async dynamicTag(interaction: ChatInputCommandInteraction<'cached'>) {
		const playerTag = interaction.options.getString('tag');

		if (playerTag) {
			return playerTag;
		} else {
			const [data] = await container.sql<[{ clanTag: string }]>`SELECT clan_tag
                                                                        FROM clans
                                                                        WHERE user_id = ${interaction.user.id} LIMIT 1`;
			if (isNullishOrEmpty(data)) {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: bold(
						"My poor eyes can't find any clan linked to your account. Please link any or provide the tag while running the command!"
					)
				});
			}

			return data.clanTag;
		}
	}
}
