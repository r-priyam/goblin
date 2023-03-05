import { ApplyOptions } from '@sapphire/decorators';
import { SnowflakeRegex } from '@sapphire/discord.js-utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { DiscordAPIError, EmbedBuilder, userMention } from 'discord.js';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ChatInputCommandInteraction, User } from 'discord.js';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors } from '#utils/constants';

@ApplyOptions<GoblinCommandOptions>({
	requiredMemberPermissions: PermissionFlagsBits.BanMembers,
	command: (builder) =>
		builder
			.setName('hackban')
			.setDescription('Bans the user from server by id, not matter if they are in server or not')
			.addStringOption((option) =>
				option //
					.setName('id')
					.setDescription('ID of the user to ban')
					.setRequired(true)
			),
	commandMetaOptions: { idHints: ['999333483006673006', '999338916232581171'] }
})
export class HackBanCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();
		const userId = interaction.options.getString('id', true);

		if (!SnowflakeRegex.test(userId)) {
			return interaction.editReply({ content: 'Not a valid user id' });
		}

		let user: User;

		try {
			user = await this.client.users.fetch(userId);
		} catch (error) {
			if (error instanceof DiscordAPIError && error.status === 404) {
				return interaction.editReply({
					embeds: [new EmbedBuilder().setDescription("User with the provided id doesn't exist").setColor(Colors.Red)]
				});
			}

			return interaction.editReply({
				content: `Something went wrong, please try again. If this keeps happening then please report to ${userMention(
					'292332992251297794'
				)}`
			});
		}

		await interaction.guild.bans.create(user, {
			reason: `Forced ban ${user.username}. Action carried out by ${interaction.user.username}`
		});
		return interaction.editReply({
			embeds: [new EmbedBuilder().setDescription(`Successfully banned ${user.username}`).setColor(Colors.Green)]
		});
	}
}
