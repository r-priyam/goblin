import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<ScheduledTask.Options>({
	cron: '0 */2 * * *'
})
export class SyncClanEmbedTask extends ScheduledTask {
	public override async run() {
		const data = await this.sql`SELECT clan_tag, leader_discord_id, requirements, color, message_id, channel_id
                                    FROM clan_embeds`;
	}
}
