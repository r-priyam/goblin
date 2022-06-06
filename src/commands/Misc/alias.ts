import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { MessageEmbed } from 'discord.js';

import { clanHelper } from '#lib/coc';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors } from '#utils/constants';
import { redis } from '#utils/redis';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Commands related to aliases'
})
export class AliasCommand extends GoblinCommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName('alias')
					.setDescription(this.description)
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
					),
			{ idHints: ['983041653034074203'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		if (!interaction.member.roles.cache.has('349856938579984385')) {
			this.userError({ message: "You aren't allowed to use this command" });
		}

		await interaction.deferReply({ ephemeral: true });

		const subCommand = interaction.options.getSubcommand(true) as 'create' | 'remove';
		return subCommand === 'create' ? this.createAlias(interaction) : this.removeAlias(interaction);
	}

	private async createAlias(interaction: ChatInputCommand.Interaction<'cached'>) {
		const clanTag = interaction.options.getString('tag', true);
		const alias = interaction.options.getString('alias', true);

		if (alias.length <= 1 || alias.length > 5) {
			throw new UserError({
				identifier: 'arg-error',
				message: 'Alias length must be greater than 1 and less than 6'
			});
		}

		const clan = await clanHelper.info(clanTag);

		try {
			await this.sql`INSERT INTO aliases (alias, clan_name, clan_tag)
                           VALUES (${alias}, ${clan.name}, ${clan.tag})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: 'database-error',
					message: `Alias for **${clan.name} (${clan.tag})** is already present`
				});
			}
		}

		await redis.handleAliasOperations('CREATE', clan.tag, alias, clan.name);
		return interaction.editReply({
			embeds: [
				new MessageEmbed() //
					.setDescription(`Successfully created alias **${alias}** for ${clan.name} (${clan.tag})`)
					.setColor(Colors.Green)
			]
		});
	}

	private async removeAlias(interaction: ChatInputCommand.Interaction<'cached'>) {
		const tag = Util.formatTag(interaction.options.getString('tag', true));

		if (!Util.isValidTag(tag)) return interaction.editReply({ content: 'No clan found for the provided tag!' });

		const [result] = await this.sql<[{ clanName?: string; alias?: string }]>`DELETE
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
}