import { inlineCode } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { Clan } from 'clashofclans.js';
import { MessageActionRow, MessageButton, MessageEmbed, ModalSubmitInteraction } from 'discord.js';

import { ClanHelper } from '#lib/coc';
import { ButtonCustomIds, Colors, ModalCustomIds, ModalInputCustomIds } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class StartClanEmbedModal extends InteractionHandler {
	public override async run(interaction: ModalSubmitInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ embeds: [result.embed] });
	}

	public override async parse(interaction: ModalSubmitInteraction) {
		if (!interaction.customId.startsWith(ModalCustomIds.StartClanEmbed)) return this.none();

		await interaction.deferReply({ ephemeral: true });

		const clanTag = interaction.customId.split('-').pop()!;

		const [check] = await this.sql<[{ exists: boolean }]>`SELECT EXISTS
                                                                         (SELECT *
                                                                          FROM clan_embeds
                                                                          WHERE clan_tag = ${clanTag}
                                                                            AND guild_id = ${interaction.guildId})`;

		if (check.exists) {
			throw new UserError({
				identifier: 'clan-embed-already-exist',
				message: `The clan embed for tag ${clanTag} is already running in this server.`
			});
		}

		const leaderId = interaction.fields.getTextInputValue(ModalInputCustomIds.StartClanEmbedLeaderInput);
		// TODO: add check to verify it's a hex color code
		const embedColor = interaction.fields.getTextInputValue(ModalInputCustomIds.StartClanEmbedColorInput);

		if (!SnowflakeRegex.test(leaderId)) {
			return this.some({
				embed: new MessageEmbed()
					.setTitle('Error')
					.setDescription('Leader discord ID appears to be wrong, please double check it')
					.setColor(Colors.Red)
			});
		}

		const clan = await ClanHelper.info(clanTag);
		await this.handleClanEmbedBoardGeneration(
			interaction,
			clan,
			leaderId,
			embedColor,
			'Please click on the button in this message to set requirements'
		);

		return this.some({
			embed: new MessageEmbed()
				.setTitle('Success')
				.setDescription(`Successfully started Clan Embed automation for ${inlineCode(clan.name)}`)
				.setColor(Colors.Green)
		});
	}

	private async handleClanEmbedBoardGeneration(
		interaction: ModalSubmitInteraction,
		clan: Clan,
		leaderId: string,
		color: string,
		requirements: string
	) {
		// TODO: Error handling of any any kind? and use Result?
		const automationMessage = await interaction.channel!.send({
			embeds: [await ClanHelper.generateAutomationClanEmbed(clan, { leaderId, requirements, color })],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton() //
						.setCustomId(ButtonCustomIds.AddClanRequirement)
						.setLabel('Add Clan Requirements')
						.setStyle('PRIMARY')
				)
			]
		});

		await this.sql`INSERT INTO clan_embeds(clan_name, clan_tag, leader_discord_id, requirements, color, message_id,
                                               guild_id, channel_id)
                       VALUES (${clan.name}, ${clan.tag}, ${leaderId}, ${requirements}, ${color},
                               ${automationMessage.id}, ${automationMessage.guildId}, ${automationMessage.channelId})`;
	}
}
