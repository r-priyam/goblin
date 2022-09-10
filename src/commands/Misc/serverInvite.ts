import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandInteraction } from 'discord.js';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';

@ApplyOptions<GoblinCommandOptions>({
	canRunInDm: false,
	slashCommand: new SlashCommandBuilder() //
		.setName('serverinvite')
		.setDescription('Returns the server invite link'),
	commandMetaOptions: { idHints: ['993241403985506424', '993241985576075295'] }
})
export class ServerInviteCommand extends GoblinCommand {
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		return interaction.reply({ content: 'https://discord.me/eygcommunity' });
	}
}
