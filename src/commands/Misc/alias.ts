import { codeBlock } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { envParseArray, envParseString } from '@skyra/env-utilities';
import { Util } from 'clashofclans.js';
import { MessageEmbed, CommandInteraction } from 'discord.js';

import type { GoblinSubCommandOptions } from '#lib/extensions/GoblinSubCommand';
import type { ClanAlias } from '#lib/redis-cache/RedisCacheClient';
import type { GuildMember } from 'discord.js';

import { VerifyTag } from '#lib/decorators/VerifyTag';
import { GoblinSubCommand } from '#lib/extensions/GoblinSubCommand';
import { RedisMethods } from '#lib/redis-cache/RedisCacheClient';
import { Colors, ErrorIdentifiers } from '#utils/constants';
import { addTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinSubCommandOptions>({
	command: (builder) =>
		builder
			.setName('alias')
			.setDescription('Commands related to aliases')
			.addSubcommand((command) =>
				command
					.setName('create')
					.setDescription('Creates the alias for clan')
					.addStringOption((option) =>
						addTagOption(option, { description: 'Tag of the clan to create an alias for', required: true })
					)
					.addStringOption((option) =>
						option //
							.setName('alias')
							.setDescription('Alias of the clan')
							.setRequired(true)
					)
			)
			.addSubcommand((command) =>
				command
					.setName('remove')
					.setDescription('Removes the alias for clan')
					.addStringOption((option) =>
						addTagOption(option, { description: 'Tag of the clan to remove an alias for', required: true })
					)
			)
			.addSubcommand((command) => command.setName('list').setDescription('Lists all clan alias')),
	commandMetaOptions: { idHints: ['983041653034074203', '983446195672342689'] },
	subcommands: [
		{
			name: 'create',
			chatInputRun: 'createAlias'
		},
		{
			name: 'remove',
			chatInputRun: 'removeAlias'
		},
		{
			name: 'list',
			chatInputRun: 'listAlias'
		}
	]
})
export class AliasCommand extends GoblinSubCommand {
	public async createAlias(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
		this.canPerformAliasOperations(interaction.member);

		const clanTag = interaction.options.getString('tag', true);
		const alias = interaction.options.getString('alias', true);

		if (alias.length <= 1 || alias.length > 5) {
			throw new UserError({
				identifier: ErrorIdentifiers.BadParameter,
				message: 'Alias length must be greater than 1 and less than 6'
			});
		}

		const clan = await this.coc.clanHelper.info(clanTag);

		try {
			await this.sql`INSERT INTO aliases (alias, clan_name, clan_tag)
                           VALUES (${alias.toUpperCase()}, ${clan.name}, ${clan.tag})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `Alias for **${clan.name} (${clan.tag})** is already present`
				});
			}
		}

		await this.redis.handleAliasOperations(RedisMethods.Insert, clan.tag, alias.toUpperCase(), clan.name);
		return interaction.editReply({
			embeds: [
				new MessageEmbed() //
					.setDescription(
						`Successfully created alias **${alias.toUpperCase()}** for ${clan.name} (${clan.tag})`
					)
					.setColor(Colors.Green)
			]
		});
	}

	@VerifyTag('Clan')
	public async removeAlias(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
		this.canPerformAliasOperations(interaction.member);

		const tag = Util.formatTag(interaction.options.getString('tag', true));

		const [result] = await this.sql<[{ alias?: string; clanName?: string }]>`DELETE
                                                                                 FROM aliases
                                                                                 WHERE clan_tag = ${tag}
                                                                                 RETURNING clan_name, alias`;

		if (!result) return interaction.editReply({ content: `Alias for ${tag} doesn't exist` });

		await this.redis.handleAliasOperations(RedisMethods.Delete, tag, result.alias!);
		return interaction.editReply({
			embeds: [
				new MessageEmbed() //
					.setDescription(`Successfully deleted alias **${result.alias}** for ${result.clanName}`)
					.setColor(Colors.Green)
			]
		});
	}

	public async listAlias(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();

		const aliases = await this.redis.fetch<ClanAlias[]>('clan-aliases');
		let aliasList = 'Clan Name         Tag          Alias\n';

		for (const { name, tag, alias } of aliases!) {
			aliasList += `${name.padEnd(18, ' ')}${tag.padEnd(13, ' ')}${alias}\n`;
		}

		return interaction.editReply({ embeds: [new MessageEmbed().setDescription(codeBlock(aliasList))] });
	}

	private canPerformAliasOperations(member: GuildMember) {
		if (
			!member.roles.cache.has(envParseString('EYG_ADMINISTRATOR_ROLE')) &&
			!envParseArray('OWNERS').includes(member.id)
		) {
			throw new UserError({
				identifier: ErrorIdentifiers.MissingPermissions,
				message: "I am sorry, but unfortunately you aren't allowed to perform this action"
			});
		}
	}
}
