import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command, UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';

import { ModalCustomIds, ModalInputCustomIds } from '#utils/constants';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Starts the selected automation in the channel',
	preconditions: ['OwnerOnly']
})
export class StartCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('type')
							.setDescription('The type of automation to start')
							.addChoices({ name: 'Clan Embed', value: 'clanEmbed' })
							.setRequired(true)
					)
					.addStringOption((option) =>
						option //
							.setName('tag')
							.setDescription('Tag of the clan to start automation for')
							.setRequired(true)
					)
					.setDMPermission(false),
			{ idHints: [''] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		const startType = interaction.options.getString('type', true) as 'clanEmbed';
		return this[startType](interaction);
	}

	private async clanEmbed(interaction: ChatInputCommand.Interaction<'cached'>) {
		const clanTag = interaction.options.getString('tag', true);
		if (!Util.isValidTag(Util.formatTag(clanTag))) {
			throw new UserError({
				identifier: 'clan-wrong-tag',
				message: 'No clan found for the requested tag!'
			});
		}

		const embedModal = new Modal()
			.setTitle('Embed Start Form')
			.setCustomId(`${ModalCustomIds.StartClanEmbed}-${clanTag}`)
			.addComponents(
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					new TextInputComponent() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedLeaderInput)
						.setLabel("What's the clan leader discord id?")
						.setStyle('SHORT')
						.setMinLength(16)
						.setMaxLength(22)
						.setRequired(true)
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					new TextInputComponent() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedColorInput)
						.setLabel('Enter the embed color. For example: #FF5733')
						.setStyle('SHORT')
						.setMinLength(6)
						.setMaxLength(7)
						.setRequired(true)
				),
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					new TextInputComponent() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedTownHallRequirementsInput)
						.setLabel('Replace the 0 with required number of TownHalls')
						.setStyle('PARAGRAPH')
						.setValue('14: 0\n13: 0\n12: 0\n11: 0\n10: 0\n9: 0')
						.setMaxLength(100)
						.setRequired(true)
				)
			);

		return interaction.showModal(embedModal);
	}
}
