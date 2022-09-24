import {} from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { CommandInteraction, MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { ModalCustomIds, ModalInputCustomIds } from '#utils/constants';
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
					.addChoices({ name: 'Clan Embed', value: 'clanEmbed' })
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
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		automationMemberCheck(interaction.guildId, interaction.member);

		const startType = interaction.options.getString('type', true) as 'clanEmbed';
		return this[startType](interaction);
	}

	private async clanEmbed(interaction: CommandInteraction<'cached'>) {
		const clanTag = interaction.options.getString('tag', true);
		if (!Util.isValidTag(Util.formatTag(clanTag))) {
			throw new UserError({
				identifier: 'clan-wrong-tag',
				message: 'No clan found for the requested tag!'
			});
		}

		const embedModal = new Modal()
			.setTitle('Clan Embed Start Form')
			.setCustomId(`${ModalCustomIds.StartClanEmbed}-${Util.formatTag(clanTag)}`)
			.addComponents(
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					new TextInputComponent() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedLeader)
						.setLabel("What's the clan leader discord id?")
						.setStyle('SHORT')
						.setMinLength(16)
						.setMaxLength(22)
						.setRequired(true)
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					new TextInputComponent() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedColor)
						.setLabel('Enter the embed color. For example: #FF5733')
						.setStyle('SHORT')
						.setMinLength(6)
						.setMaxLength(7)
						.setRequired(true)
				)
			);

		return interaction.showModal(embedModal);
	}
}
