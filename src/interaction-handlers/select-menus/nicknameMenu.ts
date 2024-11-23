import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder, userMention } from 'discord.js';

import { NicknameCommand } from '#root/commands/Profile/nickname';
import { Colors, Emotes, SelectMenuCustomIds } from '#utils/constants';

import type { StringSelectMenuInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class NicknameMenu extends InteractionHandler {
	public override async run(interaction: StringSelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({
			content: null,
			embeds: [result.embed],
			components: []
		});
	}

	public override async parse(interaction: StringSelectMenuInteraction) {
		if (!interaction.customId.startsWith(SelectMenuCustomIds.Nickname)) {
			return this.none();
		}

		if (!interaction.memberPermissions?.any(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)) {
			return this.none();
		}

		await interaction.deferUpdate();
		const userId = interaction.customId.split('-').pop()!;
		const nickname = interaction.values[0];

		await NicknameCommand.updateNickname(
			interaction.guildId!,
			userId,
			nickname,
			`Nickname changed by using nicknmae command. Action by ${interaction.user.username}`
		);

		return this.some({
			embed: new EmbedBuilder()
				.setTitle(`${Emotes.Success} Success`)
				.setDescription(`Successfully changed ${userMention(userId)} nickname`)
				.setColor(Colors.Green)
		});
	}
}
