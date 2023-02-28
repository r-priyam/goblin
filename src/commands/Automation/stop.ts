import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { bold, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ChatInputCommand } from '@sapphire/framework';

import { ValidateTag } from '#lib/decorators/ValidateTag';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors, Emotes, ErrorIdentifiers } from '#utils/constants';
import { automationMemberCheck } from '#utils/functions/automationMemberCheck';
import { addTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('stop')
			.setDescription('Stops the selected automation in the channel')
			.addStringOption((option) =>
				option //
					.setName('type')
					.setDescription('The type of automation to stop')
					.addChoices({ name: 'Clan Embed', value: 'clanEmbed' }, { name: 'War Image', value: 'warImage' })
					.setRequired(true)
			)
			.addStringOption((option) =>
				addTagOption(option, { description: 'Tag of the clan to stop automation for', required: true })
			),
	requiredMemberPermissions: PermissionFlagsBits.ManageMessages,
	commandMetaOptions: { idHints: ['1010535535468630166', '1013039773142745139'] },
	preconditions: ['OwnerOnly']
})
export class StopCommand extends GoblinCommand {
	@ValidateTag({ prefix: 'clan' })
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		automationMemberCheck(interaction.guildId, interaction.member);

		const stopType = interaction.options.getString('type', true) as 'clanEmbed' | 'warImage';
		return this[stopType](interaction);
	}

	private async clanEmbed(interaction: ChatInputCommand.Interaction) {
		await interaction.deferReply();
		const clanTag = Util.formatTag(interaction.options.getString('tag', true));

		const [result] = await this.sql<[{ clanName?: string }]>`DELETE
                                                                 FROM clan_embeds
                                                                 WHERE clan_tag = ${clanTag}
                                                                   AND guild_id = ${interaction.guildId}
                                                                 RETURNING clan_name`;

		if (!result) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: `Can't find any Clan Embed running for ${bold(clanTag)} in this server`
			});
		}

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(
						`Successfully stopped ${bold(result.clanName!)}(${bold(clanTag)}) Clan Embed in this server`
					)
					.setColor(Colors.Green)
			]
		});
	}

	private async warImage(interaction: ChatInputCommand.Interaction) {
		await interaction.deferReply();
		const clanTag = Util.formatTag(interaction.options.getString('tag', true));

		const [result] = await this.sql<[{ clanName?: string }]>`DELETE
                                                                 FROM war_image_poster
                                                                 WHERE clan_tag = ${clanTag}
                                                                   AND guild_id = ${interaction.guildId}
                                                                 RETURNING clan_tag`;

		if (!result) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: `Can't find any War Image running for ${bold(clanTag)} in this server`
			});
		}

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Successfully stopped ${bold(clanTag)} War Image in this server`)
					.setColor(Colors.Green)
			]
		});
	}
}
