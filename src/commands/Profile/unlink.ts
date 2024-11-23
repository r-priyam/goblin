import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { EmbedBuilder, ChatInputCommandInteraction, inlineCode } from 'discord.js';

import { ValidateTag } from '#lib/decorators/ValidateTag';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { RedisMethods } from '#lib/redis-cache/RedisCacheClient';
import { Colors, Emotes, ErrorIdentifiers } from '#utils/constants';
import { addTagOption } from '#utils/functions/commandOptions';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('unlink')
			.setDescription('Unlink a clan or a player from your discord account')
			.addStringOption((option) =>
				option
					.setName('choice')
					.setDescription('Select what you want to unlink')
					.setRequired(true)
					.addChoices({ name: 'Clan', value: 'clan' }, { name: 'Player', value: 'player' })
			)
			.addStringOption((option) => addTagOption(option, { description: 'The tag to unlink', required: true })),
	commandMetaOptions: { idHints: ['975442552134197248', '980131949911883847'] }
})
export class UnlinkCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const type = interaction.options.getString('choice', true);
		return type === 'clan' ? this.removeClan(interaction) : this.removePlayer(interaction);
	}

	@ValidateTag({ prefix: 'clan' })
	private async removeClan(interaction: ChatInputCommandInteraction<'cached'>) {
		const tag = Util.formatTag(interaction.options.getString('tag', true));

		const [result] = await this.sql<[{ clanName?: string }]>`DELETE
                                                                 FROM clans
                                                                 WHERE user_id = ${interaction.member.id}
                                                                   AND clan_tag = ${tag}
                                                                 RETURNING clan_name`;

		if (!result) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: `Clan tag: **${inlineCode(tag)}** isn't linked to your profile`
			});
		}

		await this.redis.handleClanOrPlayerCacheCache('CLAN', RedisMethods.Delete, interaction.member.id, tag);
		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Removed **${result.clanName} (${tag})** from your discord account`)
					.setColor(Colors.Green)
			]
		});
	}

	@ValidateTag({ prefix: 'player' })
	private async removePlayer(interaction: ChatInputCommandInteraction<'cached'>) {
		const tag = Util.formatTag(interaction.options.getString('tag', true));

		const [result] = await this.sql<[{ playerName?: string }]>`DELETE
                                                                   FROM players
                                                                   WHERE user_id = ${interaction.member.id}
                                                                     AND player_tag = ${tag}
                                                                   RETURNING player_name`;

		if (!result) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: `Player tag: **${inlineCode(tag)}** isn't linked to your profile`
			});
		}

		await this.redis.handleClanOrPlayerCacheCache('PLAYER', RedisMethods.Delete, interaction.member.id, tag);
		await this.coc.linkApi.deleteLink(tag, interaction.member.id);

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Removed **${result.playerName} (${tag})** from your discord account`)
					.setColor(Colors.Green)
			]
		});
	}
}
