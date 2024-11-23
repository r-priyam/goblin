import { Buffer } from 'node:buffer';
import { inspect } from 'node:util';

import { ApplyOptions } from '@sapphire/decorators';
import { Stopwatch } from '@sapphire/stopwatch';
import { Type } from '@sapphire/type';
import { isThenable } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { EmbedBuilder, codeBlock } from 'discord.js';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors } from '#utils/constants';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { CommandInteraction, ChatInputCommandInteraction } from 'discord.js';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('eval')
			.setDescription('[Owner Only] Evaluate any JavaScript code')
			.addStringOption((option) =>
				option //
					.setName('code')
					.setDescription('The code to evaluate')
					.setRequired(true)
			)
			.addBooleanOption((option) =>
				option
					.setName('async')
					.setDescription('Whether to allow use of async/await. If set, the result will have to be returned')
					.setRequired(false)
			)
			.addBooleanOption((option) =>
				option //
					.setName('ephemeral')
					.setDescription('Whether to show the result ephemerally')
					.setRequired(false)
			)
			.addIntegerOption((option) =>
				option //
					.setName('depth')
					.setDescription('The depth of the displayed return type')
					.setRequired(false)
			),
	commandMetaOptions: {
		idHints: ['978257844585500702', '980132037891592293'],
		guildIds: [envParseString('DEVELOPMENT_GUILD')]
	},
	preconditions: ['OwnerOnly']
})
export class EvalCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		const code = interaction.options.getString('code', true);
		const depth = interaction.options.getInteger('depth');
		const isAsync = interaction.options.getBoolean('async');
		const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

		await interaction.deferReply({ ephemeral });

		const { result, success, type, elapsed } = await this.eval(interaction, code, { isAsync, depth });
		const output = success ? codeBlock('js', result) : codeBlock('bash', result);

		const embedLimitReached = output.length > 4_096;
		const embed = new EmbedBuilder()
			.setTitle('Info')
			.setDescription(embedLimitReached ? 'Output was too long! The result has been sent as a file.' : output)
			.setColor(success ? Colors.Green : Colors.Red);

		embed
			.setTitle(success ? 'Eval Result ✨' : 'Eval Error 💀')
			.addFields(
				{ name: 'Type 📝', value: codeBlock('ts', type), inline: true },
				{ name: 'Elapsed ⏱', value: elapsed, inline: true }
			);

		const files = embedLimitReached ? [{ attachment: Buffer.from(output), name: 'output.txt' }] : [];
		await interaction.editReply({ embeds: [embed], files });
	}

	protected async eval(
		interaction: CommandInteraction<'cached'>,
		code: string,
		{ isAsync, depth }: { depth: number | null; isAsync: boolean | null }
	) {
		let result: any;
		let success = true;
		let elapsed = '';
		const stopwatch = new Stopwatch();

		try {
			if (isAsync) {
				// eslint-disable-next-line no-param-reassign
				code = `(async () => {\n${code}\n})();`;
			}

			// @ts-expect-error use as a variable if needed in eval
			// eslint-disable-next-line id-length
			const i = interaction;
			// eslint-disable-next-line no-eval
			result = eval(code);
			elapsed = stopwatch.toString();
		} catch (error: unknown) {
			if (!elapsed) {
				elapsed = stopwatch.toString();
			}

			success = false;
			result = error;
		}

		stopwatch.stop();

		const type = new Type(result).toString();
		if (isThenable(result)) {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await result;
		}

		if (typeof result !== 'string') {
			result = inspect(result, { depth });
		}

		return { result, success, type, elapsed };
	}
}
