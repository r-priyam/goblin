import { bold } from '@discordjs/builders';
import { Clan, MiscEmotes } from '@goblin/clashofclans';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, Result } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { Colors } from '#utils/constants';
import { ClanAlias, redis } from '#utils/redis';

@ApplyOptions<Listener.Options>({
	name: 'AliasMessageCreate',
	event: Events.MessageCreate
})
export class BotListener extends Listener<typeof Events.MessageCreate> {
	public async run(message: Message) {
		if (message.author.bot || message.content.length > 6) return;

		const cachedAlias = await redis.get<ClanAlias[]>('clan-aliases');
		const parsedMessage = message.content.toUpperCase().split(' ', 1)[0];

		if (!cachedAlias) return;
		const possibleAlias = cachedAlias.find((aliases) => aliases.alias === parsedMessage);

		if (!possibleAlias) return;

		await message.channel.sendTyping();
		const clan = await this.coc.getClan(possibleAlias.tag);
		await message.channel.send({ embeds: [BotListener.aliasClanInfo(clan)] });
		return Result.fromAsync(() => message.delete());
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
		return new MessageEmbed()
			.setTitle(`${clan.name} (${clan.tag})`)
			.setURL(clan.shareLink)
			.setDescription(info)
			.setThumbnail(clan.badge.medium)
			.setColor(Colors.Blue)
			.setTimestamp();
	}
}