import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandErrorPayload, Events, Listener, UserError } from '@sapphire/framework';
import { CommandInteraction, MessageEmbed } from 'discord.js';

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

async function errorHandler(error: Error | UserError, interaction: CommandInteraction) {
	if (error instanceof UserError) {
		const { context, message } = error;
		const isEmbed = Reflect.get(Object(context), 'embedMessage');

		if (interaction.replied || interaction.deferred) return interaction.editReply(messageOrEmbed(message, isEmbed));

		return interaction.reply({ ...messageOrEmbed(message, isEmbed), ephemeral: true });
	}
}

function messageOrEmbed(content: string, isEmbed = false) {
	if (isEmbed) return { embeds: [new MessageEmbed().setTitle('Error').setDescription(content).setColor(Colors.Red)] };

	return { content };
}
