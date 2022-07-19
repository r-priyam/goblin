import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandErrorPayload, Events, Listener, UserError } from '@sapphire/framework';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

import { Colors } from '#utils/constants';

@ApplyOptions<Listener.Options>({
	name: 'ChatInputCommandError',
	event: Events.ChatInputCommandError
})
export class UserListener extends Listener<typeof Events.ChatInputCommandError> {
	public async run(error: Error, { interaction }: ChatInputCommandErrorPayload) {
		await errorHandler(error, interaction);
	}
}

// @ts-expect-error TODO: use webhook to report error...
async function errorHandler(error: Error | UserError, interaction: CommandInteraction) {
	if (error instanceof UserError) {
		const isEmbed = Reflect.get(Object(error.context), 'embedMessage');

		if (interaction.replied || interaction.deferred) {
			return interaction.editReply(messageOrEmbed(error.message, isEmbed));
		}

		return interaction.reply({ ...messageOrEmbed(error.message, isEmbed), ephemeral: true });
	}
}

function messageOrEmbed(content: string, isEmbed = false) {
	if (isEmbed) {
		return { embeds: [new EmbedBuilder().setDescription(content).setColor(Colors.Green)], allowedMentions: { parse: [] } };
	}

	return { content, allowedMentions: { parse: [] } };
}
