import { time, TimestampStyles } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { GuildMember, MessageActionRow, MessageButton, MessageEmbed, Role } from 'discord.js';
import { Colors } from '#lib/util/constants';
import { GoblinCommand } from '#root/lib/extensions/GoblinCommand';

const sortRanks = (x: Role, y: Role) => Number(y.position > x.position) || Number(x.position === y.position) - 1;

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get information about an user'
})
export class WhoIsCommand extends GoblinCommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option //
						.setName('user')
						.setDescription('The user to get information for')
						.setRequired(false)
				)
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();

		const member = interaction.options.getMember('user') || interaction.member;
		const roles = member.roles.cache.sorted(sortRanks);
		roles.delete(interaction.guildId);

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
			.addField('Roles', [...roles.values()].join(' '), false)
			.setFooter({
				text: `ID: ${member.id}`,
				iconURL: this.container.client.user!.displayAvatarURL({ size: 128, format: 'png', dynamic: true })
			})
			.setTimestamp();

		return interaction.editReply({ embeds: [embed], components: [WhoIsCommand.avatarUrlButton(member)] });
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
