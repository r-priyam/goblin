import { MessageComponentInteraction } from 'discord.js';

export async function collectorFiler(interaction: MessageComponentInteraction, userId: string, messageId: string) {
	if (interaction.message.id !== messageId) {
		return false;
	}

	if (interaction.user.id !== userId) {
		await interaction.followUp({
			content: "These buttons can't be controlled by you, sorry!",
			ephemeral: true
		});
		return false;
	}

	return true;
}
