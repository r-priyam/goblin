import { bold, inlineCode, userMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { envParseString } from '@skyra/env-utilities';
import { EmbedBuilder, Status } from 'discord.js';

import type { TextChannel } from 'discord.js';

import { Colors } from '#utils/constants';

@ApplyOptions<ScheduledTask.Options>({
	pattern: '*/01 * * * *',
	bullJobsOptions: {
		removeOnComplete: true
	}
})
export class EygMemberCheck extends ScheduledTask {
	public override async run() {
		if (this.container.client.ws.status !== Status.Ready) return;

		const eygGuild = await this.client.guilds.fetch(envParseString('EYG_GUILD'));
		// TODO: Write pending members check
		// const pendingMembers = await eygGuild.members.fetch().then((data) => [...data.values()].filter((member) => member.pending));

		const checkRoleMembers = await eygGuild.members
			.fetch()
			.then((member) =>
				[...member.values()].filter((member) => member.roles.cache.has(envParseString('EYG_FRESH_SPAWN_ROLE')))
			);

		if (!checkRoleMembers) return;

		for (const member of checkRoleMembers) {
			const minutes = this.getMinutes(member.joinedAt!);
			const gatewayChannel = (await this.client.channels.fetch(
				envParseString('EYG_GATEWAY_CHANNEL')
			)) as TextChannel;

			if (minutes === 60 * 12) {
				await gatewayChannel.send({
					content: userMention(member.id),
					embeds: [
						new EmbedBuilder()
							.setTitle('Warning')
							.setDescription(
								`Hello 👋\nYou have been in ${inlineCode(
									'gateway'
								)} for 12 hours now. To avoid being removed automatically, speak to a recruiter within the next ${inlineCode(
									'12 hours'
								)}. ${bold('Failure to do so will result in the removal from server.')}`
							)
							.setColor(Colors.Yellow)
					]
				});
			} else if (minutes >= 60 * 24) {
				await member.kick('Automatically kicked member for being in gateway for more than 24 hours');
				await gatewayChannel.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('Info')
							.setDescription(
								`Automatically kicked ${inlineCode(
									member.displayName
								)} from the server as they've been in ${inlineCode('gateway for more than 24 hours')}`
							)
							.setColor(Colors.Blue)
					]
				});
			}
		}
	}

	private getMinutes(time: Date) {
		let diff = (time.getTime() - Date.now()) / 1000;
		diff /= 60;
		return Math.abs(Math.round(diff));
	}
}
