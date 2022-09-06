import { codeBlock } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, UserError } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { envParseArray } from '@skyra/env-utilities';
import { Util } from 'clashofclans.js';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Colors } from '#utils/constants';
import { ClanAlias, redis } from '#utils/redis';

@ApplyOptions<Subcommand.Options>({
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
	],
	description: 'Commands related to aliases'
})
export class AliasCommand extends Subcommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName('alias')
					.setDescription(this.description)
					.setDMPermission(false)
					.addSubcommand((command) =>
						command
							.setName('create')
							.setDescription('Creates the alias for clan')
							.addStringOption((option) =>
								option //
									.setName('tag')
									.setDescription('Tag of the clan to create an alias for')
									.setRequired(true)
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
								option //
									.setName('tag')
									.setDescription('Tag of the clan to create an alias for')
									.setRequired(true)
							)
					)
					.addSubcommand((command) => command.setName('list').setDescription('Lists all clan alias')),
			{ idHints: ['983041653034074203', '983446195672342689'] }
		);
	}

	public async createAlias(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
		this.canPerformAliasOperations(interaction.member);

		const clanTag = interaction.options.getString('tag', true);
		const alias = interaction.options.getString('alias', true);

		if (alias.length <= 1 || alias.length > 5) {
			throw new UserError({
				identifier: 'arg-error',
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
					identifier: 'database-error',
					message: `Alias for **${clan.name} (${clan.tag})** is already present`
				});
			}
		}

		await redis.handleAliasOperations('CREATE', clan.tag, alias.toUpperCase(), clan.name);
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

	public async removeAlias(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
		this.canPerformAliasOperations(interaction.member);

		const tag = Util.formatTag(interaction.options.getString('tag', true));

		if (!Util.isValidTag(tag)) return interaction.editReply({ content: 'No clan found for the provided tag!' });

		const [result] = await this.sql<[{ alias?: string; clanName?: string }]>`DELETE
                                                                                 FROM aliases
                                                                                 WHERE clan_tag = ${tag}
                                                                                 RETURNING clan_name, alias`;

		if (!result) return interaction.editReply({ content: `Alias for ${tag} doesn't exist` });

		await redis.handleAliasOperations('DELETE', tag, result.alias!);
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

		const aliases = await redis.get<ClanAlias[]>('clan-aliases');
		let aliasList = 'Clan Name         Tag          Alias\n';

		for (const { name, tag, alias } of aliases!) {
			aliasList += `${name.padEnd(18, ' ')}${tag.padEnd(13, ' ')}${alias}\n`;
		}

		return interaction.editReply({ embeds: [new MessageEmbed().setDescription(codeBlock(aliasList))] });
	}

	private canPerformAliasOperations(member: GuildMember) {
		if (!member.roles.cache.has('349856938579984385') && !envParseArray('OWNERS').includes(member.id)) {
			throw new UserError({ identifier: 'user-not-allowed', message: "You aren't allowed to use this command" });
		}
	}
}
