import { inspect } from 'node:util';

import { codeBlock } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, ChatInputCommand } from '@sapphire/framework';
import { Stopwatch } from '@sapphire/stopwatch';
import { inlineCodeBlock, isNullishOrEmpty } from '@sapphire/utilities';

import { TabularData } from '#lib/classes/table';

@ApplyOptions<ChatInputCommand.Options>({
	description: '[Owner Only] Executes SQL query',
	preconditions: ['OwnerOnly']
})
export class SQLCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('query')
							.setDescription('The query to execute')
							.setRequired(true)
					),
			{ idHints: ['991266724093632532', '991269577386373190'], guildIds: ['789853678730608651'] }
		);
	}

	// @ts-expect-error I know what I am doing
	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();

		const query = interaction.options.getString('query', true);
		const { success, result, executionTime } = await this.runSql(query);

		if (!success)
			return interaction.editReply({ content: `${codeBlock('bash', String(result))}\nExecuted in: \`${inlineCodeBlock(executionTime)}\`` });
		if (isNullishOrEmpty(result))
			return interaction.editReply({ content: `Returned ${inlineCodeBlock('[]')} in ${inlineCodeBlock(executionTime)}` });

		const table = new TabularData();
		table.setColumns(Object.keys(result[0]));

		// @ts-expect-error result will be in array only
		table.addRows(result.map((r) => Object.values(r)));
		const render = table.renderTable().split('\n');
		await interaction.deleteReply();

		while (render.length > 0) {
			const toSend = render.splice(0, 12).join('\n');

			await interaction.followUp(
				render.length === 0
					? `${codeBlock('ts', toSend)}\nReturned \`${result.length}\` rows. Executed in: \`${inlineCodeBlock(executionTime)}\``
					: `${codeBlock('ts', toSend)}`
			);
		}
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
