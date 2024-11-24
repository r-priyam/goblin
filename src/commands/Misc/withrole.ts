import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { inlineCodeBlock } from '@sapphire/utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { EmbedBuilder, roleMention } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors } from '#root/lib/util/constants';

@ApplyOptions<GoblinCommandOptions>({
	requiredMemberPermissions: PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers,
	command: (builder) =>
		builder
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
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();
		const role = interaction.options.getRole('role', true);

		const members = await interaction.guild.members
			.fetch()
			.then((member) => [...member.values()].filter((member) => member.roles.cache.has(role.id)));
		const totalMembers = members.length;

		if (members.length === 0) {
			return interaction.editReply({
				content: `No member has ${roleMention(role.id)}`
			});
		}

		const namesEmbed = [];
		while (members.length > 0) {
			const embed = new EmbedBuilder()
				.setTitle(`Showing members for ${role.name}`)
				.setDescription(
					members
						.splice(0, 100)
						.map((member) => inlineCodeBlock(member.displayName))
						.join('\n')
				)
				.setFooter({
					text: `Requested by ${interaction.member.displayName}`,
					iconURL: interaction.member.displayAvatarURL({
						size: 32,
						extension: 'png',
						forceStatic: true
					})
				})
				.setColor(Colors.BlueGrey);
			namesEmbed.push(embed);
		}

		const paginatedMessage = new PaginatedMessage().addPageEmbeds(namesEmbed);
		await paginatedMessage.setIdle(Time.Minute * 3).run(interaction);

		return interaction.followUp({
			content: `Check done! Total members for ${roleMention(role.id)}: ${inlineCodeBlock(String(totalMembers))}`,
			ephemeral: true
		});
	}
}
