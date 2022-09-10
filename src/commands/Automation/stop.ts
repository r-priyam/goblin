import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { bold } from 'colorette';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { Colors } from '#utils/constants';
import { automationMemberCheck } from '#utils/functions/automationMemberCheck';
import { addTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinCommandOptions>({
	slashCommand: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the selected automation in the channel')
		.addStringOption((option) =>
			option //
				.setName('type')
				.setDescription('The type of automation to stop')
				.addChoices({ name: 'Clan Embed', value: 'clanEmbed' })
				.setRequired(true)
		)
		.addStringOption(addTagOption({ description: 'Tag of the clan to stop automation for', required: true })),
	requiredMemberPermissions: PermissionFlagsBits.ManageMessages,
	commandMetaOptions: { idHints: ['1010535535468630166', '1013039773142745139'] },
	preconditions: ['OwnerOnly']
})
export class StopCommand extends GoblinCommand {
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		automationMemberCheck(interaction.guildId, interaction.member);

		const stopType = interaction.options.getString('type', true) as 'clanEmbed';
		return this[stopType](interaction);
	}

	private async clanEmbed(interaction: ChatInputCommand.Interaction) {
		const clanTag = interaction.options.getString('tag', true);
		if (!Util.isValidTag(Util.formatTag(clanTag))) {
			throw new UserError({
				identifier: 'clan-wrong-tag',
				message: 'No clan found for the requested tag!'
			});
		}

		const [result] = await this.sql<[{ clanName?: string }]>`DELETE
                                                                 FROM clan_embeds
                                                                 WHERE clan_tag = ${clanTag}
                                                                   AND guild_id = ${interaction.guildId}
                                                                 RETURNING clan_name`;

		if (!result)
			return interaction.editReply({
				content: `Can't find any Clan Embed running for ${bold(clanTag)} in this server`
			});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(
						`Successfully stopped ${bold(result.clanName!)}(${bold(clanTag)}) Clan Embed in this server`
					)
					.setColor(Colors.Green)
			]
		});
	}
}
