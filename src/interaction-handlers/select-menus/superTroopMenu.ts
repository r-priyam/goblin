import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { SelectMenuInteraction } from 'discord.js';

import { clanHelper } from '#lib/coc';
import { SuperTroopsCommand } from '#root/commands/Clan/superTroops';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SuperTroopMenu extends InteractionHandler {
	public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.followUp({ embeds: [result.data], ephemeral: true });
	}

	public override async parse(interaction: SelectMenuInteraction) {
		if (!interaction.customId.startsWith('SUPER_TROOP_MENU')) return this.none();

		await interaction.deferReply({ ephemeral: true });

		const superTroop = interaction.values[0];

		const clan = await clanHelper.info(interaction.customId.split('_').pop()!);
		const data = await SuperTroopsCommand.getSuperTroops(clan, superTroop);
		return this.some({ data });
	}
}
