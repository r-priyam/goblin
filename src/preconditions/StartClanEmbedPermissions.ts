import { ApplyOptions } from '@sapphire/decorators';
import { Precondition } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';

import type { CommandInteraction } from 'discord.js';

import { Emotes } from '#utils/constants';

@ApplyOptions<Precondition.Options>({
	name: 'StartRequiredPermissions'
})
export class UserPrecondition extends Precondition {
	#requiredPermissions = [
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.ReadMessageHistory,
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ManageMessages,
		PermissionFlagsBits.UseExternalEmojis,
		PermissionFlagsBits.EmbedLinks
	];

	public override async chatInputRun(interaction: CommandInteraction) {
		const missingPerms = interaction.appPermissions?.missing(this.#requiredPermissions);

		return missingPerms?.length ? this.error({ message: this.formatMissingPerms(missingPerms) }) : this.ok();
	}

	private formatMissingPerms(perms: string[]) {
		const noun = perms.length === 1 ? 'permission' : 'permissions';
		let formatted = `I am missing some ${noun} to execute this command. Please allow the ${noun} mentioned below to me:\n`;
		for (const perm of perms)
			formatted += `$${Emotes.Error}${perm
				.replace('_', ' ')
				.replaceAll(/\w\S*/g, (replace) => replace.charAt(0).toUpperCase() + replace.slice(1).toLowerCase())}\n`;
		return formatted.slice(0, -2);
	}
}
