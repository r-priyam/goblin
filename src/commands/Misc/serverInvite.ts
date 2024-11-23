import { ApplyOptions } from '@sapphire/decorators';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ChatInputCommandInteraction } from 'discord.js';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder //
			.setName('serverinvite')
			.setDescription('Returns the EYG server invite link'),
	commandMetaOptions: { idHints: ['993241403985506424', '993241985576075295'] }
})
export class ServerInviteCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		return interaction.reply({ content: 'https://discord.me/eygcommunity' });
	}
}
