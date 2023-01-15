import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, Result, UserError } from '@sapphire/framework';
import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	roleMention,
	time,
	TimestampStyles,
	userMention,
	bold,
	inlineCode,
	ButtonStyle
} from 'discord.js';
import { nanoid } from 'nanoid';

import type { ButtonInteraction, TextChannel, User } from 'discord.js';

import { ButtonCustomIds, Colors, Emotes, ErrorIdentifiers } from '#utils/constants';
import { checkUser, extractConfigsFromValues } from '#utils/functions/eventHelpers';
import { seconds } from '#utils/functions/time';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		if (result.type === 'followup') {
			return interaction.followUp({ embeds: [result.embed], ephemeral: true });
		}

		return interaction.editReply({ embeds: [result.embed], components: [] });
	}

	public override async parse(interaction: ButtonInteraction) {
		if (!([ButtonCustomIds.EventSubmit, ButtonCustomIds.EventCancel] as String[]).includes(interaction.customId)) {
			return this.none();
		}

		await interaction.deferUpdate();
		checkUser(interaction.message.interaction!.user.id, interaction.user.id);

		if (interaction.customId === ButtonCustomIds.EventCancel) {
			return this.some({
				type: 'edit',
				embed: new EmbedBuilder()
					.setDescription(
						"Cancelling the new CWL event process, I hope that I haven't offended you and you will choose me for your service again 🙂"
					)
					.setColor(Colors.Lime)
			});
		}

		const rawConfigValues = interaction.message.embeds[0].description?.split('\n').slice(1, 5);
		const { eventName, registrationChannel, startRolePing, endRolePing } = extractConfigsFromValues(
			rawConfigValues!,
			true
		);

		const eventId = nanoid(16).replace('-', '');

		const messageId = await this.sendEventStartMessage(
			eventName!,
			registrationChannel!,
			interaction.user.id,
			eventId,
			startRolePing
		);

		await this.sql`
            INSERT INTO events (id,
                                name,
                                type,
                                guild_id,
                                channel_id,
                                message_id,
                                start_role_ping_id,
                                end_role_ping_id,
                                author_id)
            VALUES (${eventId},
                    ${eventName},
                    'cwl',
                    ${interaction.guildId},
                    ${registrationChannel},
                    ${messageId},
                    ${startRolePing},
                    ${endRolePing},
                    ${interaction.user.id})
        `;

		const messageUrl = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messageId}`;
		await this.sendSuccessToAuthor(interaction.user, eventId, eventName!, messageUrl);
		await this.tasks.create(
			'cwlEventEnd',
			{ channelId: registrationChannel, messageId, eventId, eventName, endRolePing },
			Time.Day * 7
		);

		return this.some({
			type: 'edit',
			embed: new EmbedBuilder()
				.setTitle(`${Emotes.Success} Success`)
				.setDescription(
					`Created ${eventName} successfully. I have attempted to send you the important information of event in DM. Event registration message link - [${bold(
						'Click me'
					)}](${messageUrl})`
				)
				.setColor(Colors.Green)
		});
	}

	private async sendEventStartMessage(
		name: string,
		channelId: string,
		authorId: string,
		eventId: string,
		pingToRole: string | null
	) {
		const channel = await this.client.channels.fetch(channelId);
		if (!channel) {
			throw new UserError({
				identifier: ErrorIdentifiers.CWLEventProcess,
				message:
					"It seems that registration channel doesn't exist or I don't have access to the channel. Please cross check",
				context: { followUp: true }
			});
		}

		const result = await Result.fromAsync(async () =>
			(channel as TextChannel).send({
				content: pingToRole ? roleMention(pingToRole) : undefined,
				embeds: [
					new EmbedBuilder()
						.setTitle(name)
						.setDescription(
							`
${bold('Started By: ')}${userMention(authorId)}
Ends ${time(seconds.fromMilliseconds(Date.now() + Time.Day * 7), TimestampStyles.RelativeTime)}

${bold('Tip')} Click on buttons to see what they can do? 🤪😉`
						)
						.setColor(Colors.LightBlue)
						.setTimestamp()
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setLabel('Register')
							.setStyle(ButtonStyle.Success)
							.setCustomId(`${ButtonCustomIds.CWLEventRegister}-${eventId}`),
						new ButtonBuilder()
							.setLabel('Unregister')
							.setStyle(ButtonStyle.Danger)
							.setCustomId(`${ButtonCustomIds.CWLEventUnregister}-${eventId}`)
					)
				]
			})
		);

		if (result.isErr()) {
			throw new UserError({
				identifier: ErrorIdentifiers.CWLEventProcess,
				message:
					'Failed to send message in the channel where I am supposed to accept the applications, please make sure I have access to the channel',
				context: { followUp: true }
			});
		}

		return result.unwrap().id;
	}

	private async sendSuccessToAuthor(user: User, id: string, name: string, messageUrl: string) {
		const embed = new EmbedBuilder()
			.setTitle(`${Emotes.Success} Created Event`)
			.setDescription(
				`
${bold('Name:')} ${inlineCode(name)}
${bold('Unique Id:')} ${inlineCode(id)}
${bold('Registration Message Link:')} [${bold('Click me')}](${messageUrl})

Regards,
Cute Goblin
`
			)
			.setColor(Colors.Green);
		await Result.fromAsync(async () => user.send({ embeds: [embed] }));
	}
}
