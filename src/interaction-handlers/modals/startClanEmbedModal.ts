import { ApplyOptions } from '@sapphire/decorators';
import { SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } from 'discord.js';

import {
	ButtonCustomIds,
	Colors,
	Emotes,
	ErrorIdentifiers,
	ModalCustomIds,
	ModalInputCustomIds
} from '#utils/constants';

import type { Clan } from 'clashofclans.js';
import type { ModalSubmitInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public override async run(interaction: ModalSubmitInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ embeds: [result.embed] });
	}

	public override async parse(interaction: ModalSubmitInteraction) {
		if (!interaction.customId.startsWith(ModalCustomIds.StartClanEmbed)) {
			return this.none();
		}

		await interaction.deferReply({ ephemeral: true });

		const clanTag = interaction.customId.split('-').pop()!;

		const [check] = await this.sql<[{ exists: boolean }]>`SELECT EXISTS
                                                                         (SELECT *
                                                                          FROM clan_embeds
                                                                          WHERE clan_tag = ${clanTag}
                                                                            AND guild_id = ${interaction.guildId})`;

		if (check.exists) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: `The clan embed for tag ${clanTag} is already running in this server.`
			});
		}

		const leaderId = interaction.fields.getTextInputValue(ModalInputCustomIds.StartClanEmbedLeader);
		const embedColor = interaction.fields.getTextInputValue(ModalInputCustomIds.StartClanEmbedColor);

		if (!SnowflakeRegex.test(leaderId)) {
			throw new UserError({
				identifier: ErrorIdentifiers.BadParameter,
				message: 'Leader discord id appears to be wrong, please double check it'
			});
		}

		if (!/^#?[\da-f]{6}$/i.test(embedColor)) {
			throw new UserError({
				identifier: ErrorIdentifiers.BadParameter,
				message: 'Clan embed color appears to be wrong, please double check it'
			});
		}

		// @ts-expect-error Is handled by optional chain
		const clan = await this.coc.clanHelper.info(interaction, clanTag);
		await this.handleClanEmbedBoardGeneration(interaction, clan, leaderId, embedColor);

		return this.some({
			embed: new EmbedBuilder()
				.setTitle(`${Emotes.Success} Success`)
				.setDescription(`Successfully started Clan Embed automation for ${inlineCode(clan.name)}`)
				.setColor(Colors.Green)
		});
	}

	private async handleClanEmbedBoardGeneration(
		interaction: ModalSubmitInteraction,
		clan: Clan,
		leaderId: string,
		color: string
	) {
		const automationMessage = await interaction.channel!.send({
			embeds: [
				await this.coc.clanHelper.generateAutomationClanEmbed(clan, {
					leaderId,
					requirements: 'Please click on the button in this message to set requirements',
					color
				})
			],
			components: [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder() //
						.setCustomId(`${ButtonCustomIds.ClanEmbedRequirement}-${clan.tag}`)
						.setLabel('Edit Clan Requirements')
						.setStyle(ButtonStyle.Secondary)
				)
			]
		});

		await this.sql`INSERT INTO clan_embeds(clan_name, clan_tag, leader_discord_id, color, message_id,
                                               guild_id, channel_id)
                       VALUES (${clan.name}, ${clan.tag}, ${leaderId}, ${color},
                               ${automationMessage.id}, ${automationMessage.guildId}, ${automationMessage.channelId})`;
	}
}
