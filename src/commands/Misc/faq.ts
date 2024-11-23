import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

import { ApplyOptions } from '@sapphire/decorators';
import { AttachmentBuilder } from 'discord.js';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { RootDir } from '#utils/constants';
import { faqsCache } from '#utils/faq';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ChatInputCommandInteraction } from 'discord.js';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('faq')
			.setDescription('Answers of all the quick questions you may have')
			.addStringOption((option) =>
				option
					.setName('key')
					.setDescription('The name or alias of the faq to send')
					.setRequired(true)
					.addChoices(
						{ name: 'API Token', value: 'api-token' },
						{ name: 'Clan Tag', value: 'clan-tag' },
						{ name: 'Player Tag', value: 'player-tag' }
					)
			),
	commandMetaOptions: { idHints: ['1033391911387545661', '1033395793903755294'] }
})
export class FAQsCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();

		const faqKey = interaction.options.getString('key', true);

		const faqImage = new AttachmentBuilder(await readFile(new URL(`meta/faq-static/${faqKey}.png`, RootDir)));
		return interaction.editReply({
			content: faqsCache.get(faqKey)?.content,
			files: [faqImage]
		});
	}
}
