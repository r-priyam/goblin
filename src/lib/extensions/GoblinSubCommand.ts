import { Subcommand } from '@sapphire/plugin-subcommands';

import type { SlashCommandBuilder } from '@discordjs/builders';
import type { ApplicationCommandRegistry, ApplicationCommandRegistryRegisterOptions } from '@sapphire/framework';

export abstract class GoblinSubCommand extends Subcommand {
	private readonly commandOptions: GoblinSubCommandOptions;

	public constructor(context: Subcommand.Context, options: GoblinSubCommandOptions) {
		super(context, { ...options });

		this.commandOptions = options;
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			(builder) =>
				this.commandOptions.command(
					builder
						.setDMPermission(this.commandOptions.canRunInDm ?? false)
						.setDefaultMemberPermissions(this.commandOptions.requiredMemberPermissions)
				),
			this.commandOptions.commandMetaOptions
		);
	}
}

export interface GoblinSubCommandOptions extends Subcommand.Options {
	canRunInDm?: boolean;
	command(builder: SlashCommandBuilder): unknown;
	commandMetaOptions?: ApplicationCommandRegistryRegisterOptions;
	requiredMemberPermissions?: bigint | number | string | null | undefined;
}
