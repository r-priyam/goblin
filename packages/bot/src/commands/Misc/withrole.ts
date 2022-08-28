import { roleMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { inlineCodeBlock } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';

import { Colors } from '#utils/constants';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Get list of members with specific role'
})
export class WithRole extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addRoleOption((option) =>
						option //
							.setName('role')
							.setDescription('Role to get members for')
							.setRequired(true)
					)
					.setDMPermission(false)
					.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers),
			{ idHints: ['997227514726461490', '997373722178617405'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		const role = interaction.options.getRole('role', true);

		const members = await interaction.guild.members
			.fetch()
			.then((member) => [...member.values()].filter((member) => member.roles.cache.has(role.id)));
		const totalMembers = members.length;
		let count = 0;

		if (members.length === 0) return interaction.editReply({ content: `No member has ${roleMention(role.id)}` });

		while (members.length !== 0) {
			const namesEmbed = new MessageEmbed()
				.setTitle(`Showing members for ${role.name}`)
				.setDescription(
					members
						.splice(0, 100)
						.map((member) => inlineCodeBlock(member.displayName))
						.join('\n')
				)
				.setFooter({
					text: `Requested by ${interaction.member.displayName}`,
					iconURL: interaction.member.displayAvatarURL({ size: 32, format: 'png', dynamic: true })
				})
				.setColor(Colors.BlueGrey);

			count === 0 ? await interaction.editReply({ embeds: [namesEmbed] }) : await interaction.followUp({ embeds: [namesEmbed] });
			count++;
		}

		return interaction.followUp({ content: `Check done! Total members for ${roleMention(role.id)}: ${inlineCodeBlock(String(totalMembers))}` });
	}
}
