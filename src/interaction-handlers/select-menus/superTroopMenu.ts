import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';

import type { SelectMenuInteraction } from 'discord.js';

import { SuperTroopsCommand } from '#root/commands/Clan/superTroops';
import { SelectMenuCustomIds } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SuperTroopMenu extends InteractionHandler {
	public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.followUp({ embeds: [result.data], ephemeral: true });
	}

	public override async parse(interaction: SelectMenuInteraction) {
		if (!interaction.customId.startsWith(SelectMenuCustomIds.SuperTroop)) return this.none();

		await interaction.deferReply({ ephemeral: true });

		const superTroop = interaction.values[0];

		// @ts-expect-error Is handled by optional chain
		const clan = await this.coc.clanHelper.info(interaction, interaction.customId.split('-').pop()!);
		const data = await SuperTroopsCommand.getSuperTroops(clan, superTroop);
		return this.some({ data });
	}
}
