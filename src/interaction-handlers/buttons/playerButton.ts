import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import type { ButtonInteraction } from 'discord.js';
import { Colors } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		await interaction.update({ components: [] }).catch(() => null);

		return interaction.followUp({
			embeds: [new EmbedBuilder().setDescription(result.message).setColor(Colors.DeepOrange)],
			ephemeral: true
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (!(interaction.customId.includes('PLAYER_INFO') || interaction.customId.includes('PLAYER_UNITS'))) {
			return this.none();
		}

		const expiryTime = interaction.customId.replaceAll(/\D/g, '');
		if (Date.now() - Number(expiryTime) >= Time.Minute * 2) {
			return this.some({
				message:
					'Uh oh! It appears that button has expired, please run `/player` command again if you wish to get the result'
			});
		}

		return this.none();
	}
}
