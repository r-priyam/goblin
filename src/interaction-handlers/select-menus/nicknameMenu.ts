import { userMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';

import type { SelectMenuInteraction } from 'discord.js';

import { NicknameCommand } from '#root/commands/Profile/nickname';
import { Colors, Emotes, SelectMenuCustomIds } from '#utils/constants';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class NicknameMenu extends InteractionHandler {
	public override async run(interaction: SelectMenuInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({ content: null, embeds: [result.embed], components: [] });
	}

	public override async parse(interaction: SelectMenuInteraction) {
		if (!interaction.customId.startsWith(SelectMenuCustomIds.Nickname)) return this.none();
		if (!interaction.memberPermissions?.any(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers))
			return this.none();

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
			embed: new MessageEmbed()
				.setTitle(`${Emotes.Success} Success`)
				.setDescription(`Successfully changed ${userMention(userId)} nickname`)
				.setColor(Colors.Green)
		});
	}
}
