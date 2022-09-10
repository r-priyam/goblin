import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { CommandInteraction } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Returns the EYG server invite link'
})
export class ServerInviteCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder //
					.setName(this.name)
					.setDescription(this.description)
					.setDMPermission(false),
			{
				idHints: ['993241403985506424', '993241985576075295']
			}
		);
	}

	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		return interaction.reply({ content: 'https://discord.me/eygcommunity' });
	}
}
