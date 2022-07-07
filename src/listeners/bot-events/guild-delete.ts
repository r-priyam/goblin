import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Guild, MessageEmbed } from 'discord.js';

import { Colors } from '#utils/constants';
import { useGuildLogsWebhook } from '#utils/webhooks/guildLogs';

@ApplyOptions<Listener.Options>({
	name: 'GuildLeave',
	event: Events.GuildDelete
})
export class GuildDeleteListener extends Listener<typeof Events.GuildDelete> {
	public override async run(guild: Guild) {
		const webhook = useGuildLogsWebhook();

		const owner = await guild.fetchOwner();
		const guildDeleteEmbed = new MessageEmbed()
			.setTitle('Left Guild')
			.addFields([
				{ name: 'Name', value: guild.name },
				{ name: 'ID', value: guild.id },
				{ name: 'Owner', value: `${owner.displayName} (ID: ${owner.id})` },
				{ name: 'Total Members', value: guild.memberCount.toLocaleString() }
			])
			.setColor(Colors.Red)
			.setTimestamp();

		if (guild.icon) guildDeleteEmbed.setThumbnail(guild.iconURL()!);

		await webhook.send({ embeds: [guildDeleteEmbed] });
	}
}
