import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Guild, EmbedBuilder } from 'discord.js';

import { Colors } from '#utils/constants';
import { useGuildLogsWebhook } from '#utils/webhooks/guildLogs';

@ApplyOptions<Listener.Options>({
	name: 'GuildCreate',
	event: Events.GuildCreate
})
export class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
	public override async run(guild: Guild) {
		const webhook = useGuildLogsWebhook();

		const owner = await guild.fetchOwner();
		const guildDeleteEmbed = new EmbedBuilder()
			.setTitle('Joined Guild')
			.addFields([
				{ name: 'Name', value: guild.name },
				{ name: 'ID', value: guild.id },
				{ name: 'Owner', value: `${owner.displayName} (ID: ${owner.id})` },
				{ name: 'Total Members', value: guild.memberCount.toLocaleString() }
			])
			.setColor(Colors.Green)
			.setTimestamp();

		if (guild.icon) guildDeleteEmbed.setThumbnail(guild.iconURL()!);
		if (guild.me) guildDeleteEmbed.setTimestamp(guild.me.joinedTimestamp);

		await webhook.send({ embeds: [guildDeleteEmbed] });
	}
}
