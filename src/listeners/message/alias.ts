import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { bold, EmbedBuilder } from 'discord.js';

import type { Clan } from 'clashofclans.js';
import type { Message } from 'discord.js';

import { MiscEmotes } from '#lib/coc';
import { Colors, RedisKeys } from '#utils/constants';

@ApplyOptions<Listener.Options>({
	name: 'AliasMessageCreate',
	event: Events.MessageCreate
})
export class BotListener extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.author.bot || message.content.length > 75) {
			return;
		}

		const cachedAlias = await this.redis.fetch(RedisKeys.ClanAlias, undefined);
		const aliasedMessage = message.content.toUpperCase().split(' ', 1);

		if (aliasedMessage.length > 1 || !cachedAlias) {
			return;
		}

		const parsedMessage = aliasedMessage[0];

		let tag: string = parsedMessage;
		if (
			parsedMessage.startsWith('HTTPS://LINK.CLASHOFCLANS.COM/EN?ACTION=OPENCLANPROFILE&TAG=') ||
			parsedMessage.includes('OPENCLANPROFILE&TAG=')
		) {
			tag = `#${parsedMessage.split('TAG=')[1].replace(/^#+/, '')}`;
		}

		const possibleAlias = cachedAlias.find((aliases) => aliases.alias === tag || aliases.tag === tag);

		if (!possibleAlias) {
			return;
		}

		await message.channel.sendTyping();
		const clan = await this.coc.getClan(possibleAlias.tag);
		await message.channel.send({ embeds: [BotListener.aliasClanInfo(clan)] });
		await message.delete();
	}

	private static aliasClanInfo(clan: Clan) {
		const info = `${bold('Members')}
${MiscEmotes.Members} ${clan.memberCount}
${bold('Required Trophies')}
${MiscEmotes.HomeTrophy} ${clan.requiredTrophies} ${MiscEmotes.BuilderTrophy} ${clan.requiredBuilderBaseTrophies}
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
