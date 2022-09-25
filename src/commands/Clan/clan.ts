import {} from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { isNullish } from '@sapphire/utilities';
import type { Clan } from 'clashofclans.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { LabelEmotes, MiscEmotes, RawClanType, RawWarFrequency, TownHallEmotes, WarLeagueEmotes } from '#lib/coc';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ClanOrPlayer } from '#lib/redis-cache/RedisCacheClient';
import { Colors, Emotes } from '#utils/constants';
import { clanTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('clan')
			.setDescription('Get info about a clan')
			.addStringOption((option) => clanTagOption(option, { autoComplete: true })),
	commandMetaOptions: { idHints: ['975586954982867024', '980132035089809429'] }
})
export class ClanCommand extends GoblinCommand {
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
		let clanTag = interaction.options.getString('tag');

		if (isNullish(clanTag)) {
			const cachedClans = await this.redis.fetch<ClanOrPlayer[]>(`c-${interaction.user.id}`);
			if (isNullish(cachedClans)) {
				return interaction.editReply({
					content:
						'You have no clan linked into your profile. Please link any clan or provide the tag as 2nd argument!'
				});
			}

			clanTag = cachedClans[0].tag;
		}

		const clan = await this.coc.clanHelper.info(clanTag);

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

	private async injectClanComposition(interaction: CommandInteraction<'cached'>, embed: MessageEmbed, clan: Clan) {
		const composition = await this.coc.clanHelper.getClanComposition(clan, true);
		// remove placeholder field for composition fetch
		embed.spliceFields(2, 1);
		embed.addFields({ name: '\u200B', value: composition as string, inline: false });
		return interaction.editReply({ embeds: [embed] });
	}

	private static infoEmbed(clan: Clan) {
		let description = '';
		description += `${MiscEmotes.HomeTrophy} **${clan.points}** ${MiscEmotes.BuilderTrophy} **${clan.versusPoints}** ${MiscEmotes.Members} **${clan.memberCount}**\n\n`;
		description += clan.description ? `${clan.description}` : 'No description set';
		if (clan.labels.length) {
			description += `\n\n${clan.labels
				.map((label) => [`${LabelEmotes[label.name]} ${label.name}`])
				.join('\n')}\n\n`;
		}

		return new MessageEmbed()
			.setTitle(clan.name)
			.setURL(clan.shareLink)
			.setDescription(description)
			.addFields(
				{
					name: '\u200B',
					value: `**Leader**
${MiscEmotes.Leader} ${clan.members.find((member) => member.role === 'leader')!.name}
${
	clan.location
		? `**Location**\n:${
				clan.location?.countryCode
					? `flag_${clan.location?.countryCode?.toLowerCase()}`
					: 'globe_with_meridians'
		  }: ${clan.location.name}`
		: '`Not set`'
}
🚪 ${RawClanType[clan.type]} ${MiscEmotes.HomeTrophy} ${clan.requiredTrophies}+ ${
						TownHallEmotes[clan.requiredTownHallLevel ?? 1]
					} ${clan.requiredTownHallLevel}`,
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
