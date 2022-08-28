import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { Clan } from 'clashofclans.js';
import { MessageEmbed } from 'discord.js';

import { ClanHelper, LabelEmotes, MiscEmotes, RawClanType, RawWarFrequency, TownHallEmotes, WarLeagueEmotes } from '#lib/coc';
import { Colors, Emotes } from '#utils/constants';
import { ClanOrPlayer, redis } from '#utils/redis';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get info about a clan'
})
export class ClanCommand extends Command {
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
					)
					.setDMPermission(false),
			{ idHints: ['975586954982867024', '980132035089809429'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		let clanTag = interaction.options.getString('tag');

		if (isNullish(clanTag)) {
			const cachedClans = await redis.get<ClanOrPlayer[]>(`c-${interaction.user.id}`);
			if (isNullish(cachedClans)) {
				return interaction.editReply({
					content: 'You have no clan linked into your profile. Please link any clan or provide the tag as 2nd argument!'
				});
			}

			clanTag = cachedClans[0].tag;
		}

		const clan = await ClanHelper.info(clanTag);

		if (clan.memberCount === 0) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setTitle('Error')
						.setDescription('Clan has 0 members, failed to collect the required data')
						.setColor(Colors.Red)
				]
			});
		}
		const infoEmbed = ClanCommand.infoEmbed(clan);

		await interaction.editReply({ embeds: [infoEmbed] });
		return this.injectClanComposition(interaction, infoEmbed, clan);
	}

	private async injectClanComposition(interaction: ChatInputCommand.Interaction<'cached'>, embed: MessageEmbed, clan: Clan) {
		const composition = await ClanHelper.getClanComposition(clan, true);
		// remove placeholder field for composition fetch
		embed.spliceFields(2, 1);
		embed.addField('\u200B', composition as string, false);
		return interaction.editReply({ embeds: [embed] });
	}

	private static infoEmbed(clan: Clan) {
		let description = '';
		description += `${MiscEmotes.HomeTrophy} **${clan.points}** ${MiscEmotes.BuilderTrophy} **${clan.versusPoints}** ${MiscEmotes.Members} **${clan.memberCount}**\n\n`;
		description += clan.description ? `${clan.description}` : 'No description set';
		clan.labels.length && (description += `\n\n${clan.labels.map((label) => [`${LabelEmotes[label.name]} ${label.name}`]).join('\n')}\n\n`);

		return new MessageEmbed()
			.setTitle(clan.name)
			.setURL(clan.shareLink)
			.setDescription(description)
			.addFields(
				{
					name: '\u200B',
					value: `**Leader**
${MiscEmotes['Leader']} ${clan.members.find((member) => member.role === 'leader')!.name}
${
	clan.location
		? `**Location**\n:${clan.location?.countryCode ? `flag_${clan.location?.countryCode?.toLowerCase()}` : 'globe_with_meridians'}: ${
				clan.location.name
		  }`
		: '`Not set`'
}
🚪 ${RawClanType[clan.type]} ${MiscEmotes.HomeTrophy} ${clan.requiredTrophies}+ ${TownHallEmotes[clan.requiredTownHallLevel ?? 1]} ${
						clan.requiredTownHallLevel
					}`,
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
