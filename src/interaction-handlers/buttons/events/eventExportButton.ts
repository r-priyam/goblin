import { Buffer } from 'node:buffer';

import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullOrUndefinedOrEmpty } from '@sapphire/utilities';

import type { ButtonInteraction } from 'discord.js';

import { ButtonCustomIds, ErrorIdentifiers } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ files: result.exportFile });
	}

	public override async parse(interaction: ButtonInteraction) {
		if (!interaction.customId.startsWith(ButtonCustomIds.CWLEventEndExport)) return this.none();

		await interaction.deferReply({ ephemeral: true });
		const eventId = interaction.customId.split('_').pop()!;

		const registrations = await this.sql`SELECT * FROM get_cwl_applications(${eventId})`;

		if (isNullOrUndefinedOrEmpty(registrations)) {
			throw new UserError({
				identifier: ErrorIdentifiers.CWLEventProcess,
				message: "It appears that no one has registered for this event, so can't export anything for you 🥺"
			});
		}

		let data =
			'Registration Id, Discord Name, Discord Id, Player Name, Player Tag, TownHall, Barbarian King, Archer Queen, Grand Warden, Royal Champion, Is Serious, Is Casual, Day One, Day Two, Day Three, Day Four, Day Five, Day Six, Day Seven, Registered At\n';

		for (const registration of registrations) {
			data += `${Object.values(registration).join(',')}\n`;
		}

		return this.some({
			exportFile: [{ attachment: Buffer.from(data), name: `${Date.now()}_export.csv` }]
		});
	}
}
