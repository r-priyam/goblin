import { ApplyOptions } from '@sapphire/decorators';
import { ButtonStyle } from 'discord-api-types/v10';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, time, TimestampStyles } from 'discord.js';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors } from '#lib/util/constants';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ChatInputCommandInteraction, GuildMember, Role } from 'discord.js';

const sortRanks = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('userinfo')
			.setDescription('Get discord related information for user')
			.addUserOption((option) =>
				option //
					.setName('user')
					.setDescription('The user to get information for')
					.setRequired(false)
			),
	commandMetaOptions: { idHints: ['987411522198335619', '987411679115624502'] }
})
export class UserInfoCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();
		const member = interaction.options.getMember('user') ?? interaction.member;

		const embed = new EmbedBuilder()
			.setColor(member.displayColor || Colors.White)
			.setThumbnail(
				member.displayAvatarURL({
					size: 256,
					extension: 'png',
					forceStatic: true
				})
			)
			.setTitle(member.user.tag)
			.addFields(
				{
					name: 'Joined',
					value: `${time(member.joinedAt!, TimestampStyles.LongDateTime)} ${time(
						member.joinedAt!,
						TimestampStyles.RelativeTime
					)}`,
					inline: false
				},
				{
					name: 'Created',
					value: `${time(member.user.createdAt!, TimestampStyles.LongDateTime)} ${time(
						member.user.createdAt!,
						TimestampStyles.RelativeTime
					)}`,
					inline: false
				}
			)
			.setFooter({
				text: `ID: ${member.id}`,
				iconURL: this.container.client.user!.displayAvatarURL({
					size: 128,
					extension: 'png',
					forceStatic: true
				})
			})
			.setTimestamp();
		this.addRoles(interaction.guildId, member, embed);

		return interaction.editReply({
			embeds: [embed],
			components: [UserInfoCommand.avatarUrlButton(member)]
		});
	}

	private addRoles(guildId: string, member: GuildMember, embed: EmbedBuilder) {
		if (member.roles.cache.size <= 1) {
			return;
		}

		const roles = member.roles.cache.sorted(sortRanks);
		roles.delete(guildId);

		const value = [...roles.values()].join(' ');
		embed.addFields({
			name: 'Roles',
			value: `${value.length > 1_024 ? `${value.slice(1, 1_020)}...` : value}`,
			inline: false
		});
	}

	private static avatarUrlButton(member: GuildMember) {
		return new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder() //
				.setLabel('🖼️ Avatar')
				.setStyle(ButtonStyle.Link)
				.setURL(
					member.displayAvatarURL({
						size: 512,
						extension: 'png',
						forceStatic: true
					})
				)
		]);
	}
}
