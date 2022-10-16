import { inspect } from 'node:util';

import { codeBlock } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { inlineCodeBlock, isNullishOrEmpty } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { markdownTable } from 'markdown-table';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { CommandInteraction } from 'discord.js';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('sql')
			.setDescription('[Owner Only] Executes SQL query')
			.addStringOption((option) =>
				option //
					.setName('query')
					.setDescription('The query to execute')
					.setRequired(true)
			),
	commandMetaOptions: {
		idHints: ['991266724093632532', '991269577386373190'],
		guildIds: [envParseString('DEVELOPMENT_GUILD')]
	},
	preconditions: ['OwnerOnly']
})
export class SQLCommand extends GoblinCommand {
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();

		const query = interaction.options.getString('query', true);
		const { success, result, executionTime } = await this.runSql(query);

		if (!success)
			return interaction.editReply({
				content: `${codeBlock('bash', String(result))}\nExecuted in: \`${inlineCodeBlock(executionTime)}\``
			});
		if (isNullishOrEmpty(result))
			return interaction.editReply({
				content: `Returned ${inlineCodeBlock('[]')} in ${inlineCodeBlock(executionTime)}`
			});

		const columns = Object.keys(result[0]);
		// @ts-expect-error result will be arrayed of objects always
		const rows: string[][] = result.map((row) => Object.values(row));

		const toSend = markdownTable([columns, ...rows.splice(0, 12)]);
		await interaction.editReply(
			rows.length === 0
				? `${codeBlock('ts', toSend)}\nReturned \`${result.length}\` rows. Executed in: \`${inlineCodeBlock(
						executionTime
				  )}\``
				: `${codeBlock('ts', toSend)}`
		);

		while (rows.length > 0) {
			const toSend = markdownTable([columns, ...rows.splice(0, 12)]);
			await interaction.followUp(`${codeBlock('ts', toSend)}`);
		}

		return interaction.followUp({
			content: `${codeBlock('ts', toSend)}\nReturned \`${result.length}\` rows. Executed in: \`${inlineCodeBlock(
				executionTime
			)}\``
		});
	}

	private async runSql(query: string) {
		let result;
		let success = true;
		let executionTime = '';
		const stopwatch = new Stopwatch();

		try {
			result = await this.sql.unsafe(query);
			executionTime = stopwatch.toString();
		} catch (error: unknown) {
			if (!executionTime) executionTime = stopwatch.toString();
			success = false;
			result = error instanceof Error ? error.message : inspect(error, { depth: 0 });
		}

		stopwatch.stop();
		return { success, result, executionTime };
	}
}
