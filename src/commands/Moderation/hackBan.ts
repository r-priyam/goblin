import { userMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { DiscordAPIError, MessageEmbed, User } from 'discord.js';

import { Colors } from '#utils/constants';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Bans the user from server by id, not matter if they are in server or not'
})
export class HackBan extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) => option.setName('id').setDescription('ID of the user to ban').setRequired(true))
					.setDMPermission(false)
					.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
			{ idHints: ['999333483006673006', '999338916232581171'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		const userId = interaction.options.getString('id', true);

		if (!SnowflakeRegex.test(userId)) {
			return interaction.editReply({ content: 'Not a valid user id' });
		}

		let user: User;

		try {
			user = await this.client.users.fetch(userId);
		} catch (error) {
			if (error instanceof DiscordAPIError && error.httpStatus === 404) {
				return interaction.editReply({
					embeds: [new MessageEmbed().setDescription("User with the provided id doesn't exist").setColor(Colors.Red)]
				});
			}

			return interaction.editReply({
				content: `Something went wrong, please try again. If this keeps happening then please report to ${userMention('292332992251297794')}`
			});
		}

		await interaction.guild.bans.create(user, { reason: `Forced ban ${user.username}. Action carried out by ${interaction.user.username}` });
		return interaction.editReply({ embeds: [new MessageEmbed().setDescription(`Successfully banned ${user.username}`).setColor(Colors.Green)] });
	}
}
