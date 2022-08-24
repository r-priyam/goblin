import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Stops the selected automation in the channel',
	preconditions: ['OwnerOnly']
})
export class StopCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('type')
							.setDescription('The type of automation to stop')
							.addChoices({ name: 'Clan Embed', value: 'ClanEmbed' })
							.setRequired(true)
					)
					.addStringOption((option) =>
						option //
							.setName('tag')
							.setDescription('Tag of the clan to stop automation for')
							.setRequired(true)
					)
					.setDMPermission(false),
			{ idHints: [''] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		//
	}
}
