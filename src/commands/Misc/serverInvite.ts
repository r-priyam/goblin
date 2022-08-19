import { ApplyOptions } from '@sapphire/decorators';
import { Command, ChatInputCommand } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Returns the EYG server invite link'
})
export class ServerInvite extends Command {
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

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		return interaction.reply({ content: 'http://discord.me/eygcommunity' });
	}
}
