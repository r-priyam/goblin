import { bold } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import type { Clan } from 'clashofclans.js';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

import { MiscEmotes } from '#lib/coc';
import { Colors } from '#utils/constants';
import { ClanAlias, redis } from '#utils/redis';

@ApplyOptions<Listener.Options>({
	name: 'AliasMessageCreate',
	event: Events.MessageCreate
})
export class AliasListener extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.author.bot || message.content.length > 6) return;

		const cachedAlias: ClanAlias[] = await redis.get('clan-aliases');
		const parsedMessage = message.content.toUpperCase().split(' ', 1)[0];

		if (!cachedAlias) return;
		const possibleAlias = cachedAlias.find((aliases) => aliases.alias === parsedMessage);

		if (!possibleAlias) return;

		const clan = await this.coc.getClan(possibleAlias.tag);
		return message.channel.send({ embeds: [AliasListener.aliasClanInfo(clan)] });
	}

	private static aliasClanInfo(clan: Clan) {
		const info = `${bold('Members')}
${MiscEmotes.Members} ${clan.memberCount}
${bold('Required Trophies')}
${MiscEmotes.HomeTrophy} ${clan.requiredTrophies} ${MiscEmotes.BuilderTrophy} ${clan.requiredVersusTrophies}
${bold('War Stats')}
 Wins ${MiscEmotes.Sword} ${clan.warWins}
Streak ${MiscEmotes.Shield} ${clan.warWinStreak}

${bold('Description')}
${clan.description || 'No description'}`;
		return new MessageEmbed()
			.setTitle(`${clan.name} (${clan.tag})`)
			.setURL(clan.shareLink)
			.setDescription(info)
			.setThumbnail(clan.badge.medium)
			.setColor(Colors.Blue)
			.setTimestamp();
	}
}
