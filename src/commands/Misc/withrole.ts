import { roleMention, SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { inlineCodeBlock } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { Colors } from '#root/lib/util/constants';

@ApplyOptions<GoblinCommandOptions>({
	requiredMemberPermissions: PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers,
	slashCommand: new SlashCommandBuilder()
		.setName('withrole')
		.setDescription('Get list of members with specific role')
		.addRoleOption((option) =>
			option //
				.setName('role')
				.setDescription('Role to get members for')
				.setRequired(true)
		),
	commandMetaOptions: { idHints: ['997227514726461490', '997373722178617405'] }
})
export class WithRoleCommand extends GoblinCommand {
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
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

			if (count === 0) {
				await interaction.editReply({ embeds: [namesEmbed] });
				count++;
				continue;
			}

			await interaction.followUp({ embeds: [namesEmbed] });
			count++;
		}

		return interaction.followUp({
			content: `Check done! Total members for ${roleMention(role.id)}: ${inlineCodeBlock(String(totalMembers))}`
		});
	}
}
