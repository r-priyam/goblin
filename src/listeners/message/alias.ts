import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, Result } from '@sapphire/framework';
import type { Clan } from 'clashofclans.js';
import { Message, EmbedBuilder, bold } from 'discord.js';
import { MiscEmotes } from '#lib/coc';
import type { ClanAlias } from '#lib/redis-cache/RedisCacheClient';
import { Colors } from '#utils/constants';

@ApplyOptions<Listener.Options>({
	name: 'AliasMessageCreate',
	event: Events.MessageCreate
})
export class BotListener extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.author.bot || message.content.length > 6) return;

		const cachedAlias = await this.redis.fetch<ClanAlias[]>('clan-aliases');
		const parsedMessage = message.content.toUpperCase().split(' ', 1)[0];

		if (!cachedAlias) return;
		const possibleAlias = cachedAlias.find((aliases) => aliases.alias === parsedMessage);

		if (!possibleAlias) return;

		await message.channel.sendTyping();
		const clan = await this.coc.getClan(possibleAlias.tag);
		await message.channel.send({ embeds: [BotListener.aliasClanInfo(clan)] });
		await Result.fromAsync(async () => message.delete());
	}

	private static aliasClanInfo(clan: Clan) {
		const info = `${bold('Members')}
${MiscEmotes.Members} ${clan.memberCount}
${bold('Required Trophies')}
${MiscEmotes.HomeTrophy} ${clan.requiredTrophies} ${MiscEmotes.BuilderTrophy} ${clan.requiredVersusTrophies}
${bold('War Stats')}
 ${MiscEmotes.Sword} ${clan.warWins} Wins
${MiscEmotes.WarStreak} ${clan.warWinStreak} Streak

${bold('Description')}
${clan.description || 'No description'}`;
		return new EmbedBuilder()
			.setTitle(`${clan.name} (${clan.tag})`)
			.setURL(clan.shareLink)
			.setDescription(info)
			.setThumbnail(clan.badge.medium)
			.setColor(Colors.Blue)
			.setTimestamp();
	}
}
