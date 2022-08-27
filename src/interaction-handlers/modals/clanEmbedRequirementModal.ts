import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { MessageEmbed, ModalSubmitInteraction } from 'discord.js';

import { Colors, ModalCustomIds, ModalInputCustomIds } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class StartClanEmbedModal extends InteractionHandler {
	public override async run(interaction: ModalSubmitInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ embeds: [result.embed] });
	}

	public override async parse(interaction: ModalSubmitInteraction) {
		if (!interaction.customId.startsWith(ModalCustomIds.ClanEmbedRequirements)) return this.none();

		await interaction.deferReply({ ephemeral: true });

		const clanTag = interaction.customId.split('-').pop()!;
		const requirements = {
			'14': this.validateRequirement(interaction.fields.getTextInputValue(ModalInputCustomIds.FourteenRequirements)),
			'13': this.validateRequirement(interaction.fields.getTextInputValue(ModalInputCustomIds.ThirteenRequirements)),
			'12': this.validateRequirement(interaction.fields.getTextInputValue(ModalInputCustomIds.TwelveRequirements)),
			'11': this.validateRequirement(interaction.fields.getTextInputValue(ModalInputCustomIds.ElevenRequirements)),
			'10': this.validateRequirement(interaction.fields.getTextInputValue(ModalInputCustomIds.TenRequirements))
		};

		await this.handleClanRequirementUpdate(interaction.guildId!, clanTag, requirements);
		return this.some({
			embed: new MessageEmbed()
				.setDescription('Clan requirements updated successfully, changes will reflect soon in the embed')
				.setColor(Colors.Green)
		});
	}

	private async handleClanRequirementUpdate(guildId: string, clanTag: string, requirements: Record<string, number>) {
		await this.sql`UPDATE clan_embed SET requirements = ${requirements} WHERE clan_tag = ${clanTag} AND guild_id = ${guildId}`;
	}

	private validateRequirement(value: string) {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? 0 : parsed;
	}
}
