import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';

import { GoblinCommand } from '#root/lib/extensions/GoblinCommand';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get information about an user'
})
export class WhoIsCommand extends GoblinCommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) =>
						option //
							.setName('user')
							.setDescription('The user to get information for')
							.setRequired(false)
					),
			{ idHints: ['974749593696874506', '980131954139734138'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		return interaction.reply({ content: 'Under construction, stay tuned!', ephemeral: true });
	}
}
