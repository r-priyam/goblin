import { SlashCommandBuilder, time, TimestampStyles } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Role } from 'discord.js';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { Colors } from '#lib/util/constants';

const sortRanks = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;

@ApplyOptions<GoblinCommandOptions>({
	slashCommand: new SlashCommandBuilder()
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
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
		const member = interaction.options.getMember('user') ?? interaction.member;

		const embed = new MessageEmbed()
			.setColor(member.displayColor || Colors.White)
			.setThumbnail(member.displayAvatarURL({ size: 256, format: 'png', dynamic: true }))
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
		embed.addFields({
			name: 'Roles',
			value: `${value.length > 1024 ? `${value.slice(1, 1020)}...` : value}`,
			inline: false
		});
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
