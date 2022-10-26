import { roleMention, time, TimestampStyles, userMention, bold, inlineCode } from '@discordjs/builders';
import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, Result, UserError } from '@sapphire/framework';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

import type { ButtonInteraction, TextChannel, User } from 'discord.js';

import { ButtonCustomIds, Colors, Emotes, ErrorIdentifiers } from '#utils/constants';
import { checkUser, extractConfigsFromValues } from '#utils/functions/eventHelpers';
import { seconds } from '#utils/functions/time';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	#keepNumbesRegex = /[^\d A-Za-z]/g;

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
				embed: new MessageEmbed()
					.setDescription(
						"Cancelling the new CWL event proceess, I hope that I haven't offended you and you will choose me for your service again 🙂"
					)
					.setColor(Colors.Lime)
			});
		}

		const rawConfigValues = interaction.message.embeds[0].description?.split('\n').slice(3, 7);
		const parsedData = extractConfigsFromValues(rawConfigValues!, true);

		const registrationChannel = parsedData.registrationChannel!.replace(this.#keepNumbesRegex, '');
		const startRolePing = parsedData.startRolePing?.replace(this.#keepNumbesRegex, '') ?? null;
		const endRolePing = parsedData.endRolePing?.replace(this.#keepNumbesRegex, '') ?? null;

		const messageId = await this.sendEventStartMessage(
			parsedData.eventName!,
			registrationChannel!,
			interaction.user.id,
			startRolePing
		);

		const [{ id }] = await this.sql<[{ id: string }]>`
			INSERT INTO events (name,
			                    type,
			                    guild_id,
			                    channel_id,
								message_id,
			                    start_role_ping_id,
			                    end_role_ping_id,
			                    author_id)
			VALUES (${parsedData.eventName},
			        'cwl',
			        ${interaction.guildId},
			        ${registrationChannel},
					${messageId},
			        ${startRolePing},
			        ${endRolePing},
			        ${interaction.user.id})
			RETURNING id`;

		const messageUrl = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messageId}`;
		await this.sendSuccessToAuthor(interaction.user, id, parsedData.eventName!, messageUrl);

		return this.some({
			type: 'edit',
			embed: new MessageEmbed()
				.setTitle(`${Emotes.Success} Success`)
				.setDescription(
					`Created ${
						parsedData.eventName
					} successfully. I have attempted to send you the important information of event in DM. Event registation message link - [${bold(
						'Click me'
					)}](${messageUrl})`
				)
				.setColor(Colors.Green)
		});
	}

	private async sendEventStartMessage(name: string, channelId: string, authorId: string, pingToRole: string | null) {
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
				content: pingToRole ? roleMention(pingToRole) : null,
				embeds: [
					new MessageEmbed()
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
					new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel('Register')
							.setStyle('SUCCESS')
							.setCustomId(ButtonCustomIds.CWLEventRegister),
						new MessageButton()
							.setLabel('Unregister')
							.setStyle('DANGER')
							.setCustomId(ButtonCustomIds.CWLEventUnregister)
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
		const embed = new MessageEmbed()
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
