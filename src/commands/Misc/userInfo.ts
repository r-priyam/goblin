import { time, TimestampStyles } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { GuildMember, MessageActionRow, MessageButton, MessageEmbed, Role } from 'discord.js';
import { Colors } from '#lib/util/constants';

const sortRanks = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get discord related information for user'
})
export class UserInfoCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addUserOption((option) =>
						option //
							.setName('user')
							.setDescription('The user to get information for')
							.setRequired(false)
					)
					.setDMPermission(false),
			{ idHints: ['987411522198335619', '987411679115624502'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		const member = interaction.options.getMember('user') || interaction.member;

		const embed = new MessageEmbed()
			.setColor(member.displayColor || Colors.White)
			.setThumbnail(member.displayAvatarURL({ size: 256, format: 'png', dynamic: true }))
			.setTitle(member.user.tag)
			.addField(
				'Joined',
				`${time(member.joinedAt!, TimestampStyles.LongDateTime)} ${time(member.joinedAt!, TimestampStyles.RelativeTime)}`,
				false
			)
			.addField(
				'Created',
				`${time(member.user.createdAt!, TimestampStyles.LongDateTime)} ${time(member.user.createdAt!, TimestampStyles.RelativeTime)}`,
				false
			)
			.setFooter({
				text: `ID: ${member.id}`,
				iconURL: this.container.client.user!.displayAvatarURL({ size: 128, format: 'png', dynamic: true })
			})
			.setTimestamp();
		this.addRoles(interaction.guildId, member, embed);

		return interaction.editReply({ embeds: [embed], components: [UserInfoCommand.avatarUrlButton(member)] });
	}

	private addRoles(guildId: string, member: GuildMember, embed: MessageEmbed) {
		if (member.roles.cache.size <= 1) {
			return;
		}

		const roles = member.roles.cache.sorted(sortRanks);
		roles.delete(guildId);

		const value = [...roles.values()].join(' ');
		embed.addField('Roles', `${value.length > 1024 ? `${value.slice(1, 1020)}...` : value}`, false);
	}

	private static avatarUrlButton(member: GuildMember) {
		return new MessageActionRow().addComponents([
			new MessageButton() //
				.setLabel('🖼️ Avatar')
				.setStyle('LINK')
				.setURL(member.displayAvatarURL({ size: 512, format: 'png', dynamic: true }))
		]);
	}
}
