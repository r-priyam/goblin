import { ApplyOptions } from '@sapphire/decorators';
import { Util } from 'clashofclans.js';
import { PermissionFlagsBits, TextInputStyle } from 'discord-api-types/v10';
import {
	ButtonBuilder,
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	ChatInputCommandInteraction,
	bold,
	ButtonStyle,
	EmbedBuilder
} from 'discord.js';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';

import { ValidateTag } from '#lib/decorators/ValidateTag';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { ButtonCustomIds, Colors, ModalCustomIds, ModalInputCustomIds } from '#utils/constants';
import { automationMemberCheck } from '#utils/functions/automationMemberCheck';
import { addTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('start')
			.setDescription('Starts the selected automation in the channel')
			.addStringOption((option) =>
				option
					.setName('type')
					.setDescription('The type of automation to start')
					.addChoices({ name: 'Clan Embed', value: 'clanEmbed' }, { name: 'War Image', value: 'warImage' })
					.setRequired(true)
			)
			.addStringOption((option) =>
				addTagOption(option, { description: 'Tag of the clan to start automation for', required: true })
			),
	requiredMemberPermissions: PermissionFlagsBits.ManageMessages,
	commandMetaOptions: { idHints: ['1010855609043787796', '1013039770429034547'] },
	preconditions: ['StartRequiredPermissions']
})
export class StartCommand extends GoblinCommand {
	@ValidateTag({ prefix: 'clan' })
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		automationMemberCheck(interaction.guildId, interaction.member);

		const startType = interaction.options.getString('type', true) as 'clanEmbed' | 'warImage';
		return this[startType](interaction);
	}

	private async clanEmbed(interaction: ChatInputCommandInteraction<'cached'>) {
		const clanTag = interaction.options.getString('tag', true);

		const embedModal = new ModalBuilder()
			.setTitle('Clan Embed Start Form')
			.setCustomId(`${ModalCustomIds.StartClanEmbed}-${Util.formatTag(clanTag)}`)
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedLeader)
						.setLabel("What's the clan leader discord id?")
						.setStyle(TextInputStyle.Short)
						.setMinLength(16)
						.setMaxLength(22)
						.setRequired(true)
				),
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedColor)
						.setLabel('Enter the embed color. For example: #FF5733')
						.setStyle(TextInputStyle.Short)
						.setMinLength(6)
						.setMaxLength(7)
						.setRequired(true)
				)
			);

		return interaction.showModal(embedModal);
	}

	private async warImage(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();

		const clan = await this.coc.clanHelper.info(interaction, interaction.options.getString('tag', true));

		const warImagePosterEmbed = new EmbedBuilder()
			.setTitle(`${clan.name} War Image Setup`)
			.setDescription(
				`Please select the war results for which you want me to post the results. You can select it by click on the respective war result type button.\n\n${bold(
					'If you click on Confirm without selecting any result type, it will be enabled for all result types.'
				)}\n\nAfter your'e done with the selection then please click on ${bold(
					'Confirm'
				)} to Submit else click on ${bold('Abort')} to cancel.`
			)
			.setThumbnail(clan.badge.medium)
			.setColor(Colors.Indigo);

		const warResultTypesRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Win')
				.setCustomId(ButtonCustomIds.WarImageWin)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setLabel('Lose')
				.setCustomId(ButtonCustomIds.WarImageLose)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setLabel('Draw')
				.setCustomId(ButtonCustomIds.WarImageDraw)
				.setStyle(ButtonStyle.Secondary)
		);

		const warImageActionsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel('Abort')
				.setStyle(ButtonStyle.Danger)
				.setCustomId(ButtonCustomIds.WarImageAbort),
			new ButtonBuilder()
				.setLabel('Confirm')
				.setStyle(ButtonStyle.Success)
				.setCustomId(`${ButtonCustomIds.WarImageConfirm}_${clan.tag}`)
		);

		return interaction.editReply({
			components: [warResultTypesRow, warImageActionsRow],
			embeds: [warImagePosterEmbed]
		});
	}
}
