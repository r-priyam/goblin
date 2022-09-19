import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandRegistry, ApplicationCommandRegistryRegisterOptions, Command } from '@sapphire/framework';

export abstract class GoblinCommand extends Command {
	private readonly commandOptions: GoblinCommandOptions;

	public constructor(context: Command.Context, options: GoblinCommandOptions) {
		super(context, { ...options });

		this.commandOptions = options;
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				this.commandOptions.slashCommand(
					builder
						.setDMPermission(this.commandOptions.canRunInDm ?? false)
						.setDefaultMemberPermissions(this.commandOptions.requiredMemberPermissions)
				),
			this.commandOptions.commandMetaOptions
		);
	}
}

export type GoblinCommandOptions = Command.Options & {
	canRunInDm?: boolean;
	commandMetaOptions?: ApplicationCommandRegistryRegisterOptions;
	requiredMemberPermissions?: bigint | number | string | null | undefined;
	slashCommand(builder: SlashCommandBuilder): unknown;
};
