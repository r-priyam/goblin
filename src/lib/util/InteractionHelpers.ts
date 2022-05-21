import type { Message, MessageComponentInteraction } from 'discord.js';

export async function verifyUser(interaction: MessageComponentInteraction, userId: string) {
	if (interaction.user.id !== userId) {
		await interaction.followUp({
			content: "These buttons can't be controlled by you, sorry!",
			ephemeral: true
		});
		return false;
	}

	return true;
}

export async function waitForButtonClick(interactionMessage: Message, userId: string, timeout: number) {
	return interactionMessage.awaitMessageComponent({
		componentType: 'BUTTON',
		time: timeout,
		filter: async (interaction) => verifyUser(interaction, userId)
	});
}
