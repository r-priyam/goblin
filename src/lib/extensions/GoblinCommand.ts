import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandRegistry, ApplicationCommandRegistryRegisterOptions, Command } from '@sapphire/framework';

export abstract class GoblinCommand extends Command {
	private readonly chatInputCommandData: SlashCommandBuilder;

	private readonly commandMetaOptions?: ApplicationCommandRegistryRegisterOptions;

	public constructor(context: Command.Context, options: GoblinCommandOptions) {
		super(context, { ...options });

		this.chatInputCommandData = options.slashCommand;
		this.commandMetaOptions = options.commandMetaOptions;
		this.chatInputCommandData.setDMPermission(options.canRunInDm ?? false);
	}

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(this.chatInputCommandData, this.commandMetaOptions);
	}
}

export type GoblinCommandOptions = Command.Options & {
	canRunInDm?: boolean;
	commandMetaOptions?: ApplicationCommandRegistryRegisterOptions;
	requiredMemberPermissions?: bigint | number | string | null | undefined;
	slashCommand: SlashCommandBuilder;
};
