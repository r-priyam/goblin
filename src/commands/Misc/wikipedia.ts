import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { MessageEmbed } from 'discord.js';
import { stripHtml } from 'string-strip-html';
import { fetch } from 'undici';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { CommandInteraction } from 'discord.js';

import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors } from '#root/lib/util/constants';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('wikipedia')
			.setDescription('Search wikipedia for a keyword')
			.addStringOption((option) =>
				option //
					.setName('keyword')
					.setDescription('The keyword to search')
					.setRequired(true)
			),
	commandMetaOptions: { idHints: ['987351901655945326', '987409434462519337'] }
})
export class WikipediaCommand extends GoblinCommand {
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });
		const keyword = interaction.options.getString('keyword', true);

		const response = await fetch(
			`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&format=json&origin=*&srlimit=20&srsearch=${keyword}`
		).catch(() => null);

		const data = (await response?.json().catch(() => null)) as WikipediaData;

		if (response?.status !== 200) return interaction.editReply({ content: 'Something went wrong, try again!' });

		if (data.query.searchinfo.totalhits === 0) return interaction.editReply({ content: 'No result found' });

		const paginatedMessage = new PaginatedMessage({
			template: new MessageEmbed() //
				.setColor(Colors.Blue)
				.setFooter({ text: ` Showing results for ${keyword}` })
		});

		for (const search of data.query.search)
			paginatedMessage.addPageEmbed((embed) =>
				embed //
					.setURL(`https://en.wikipedia.org/?curid=${search.pageid}`)
					.setTitle(search.title)
					.setDescription(stripHtml(search.snippet).result)
			);

		return paginatedMessage.run(interaction);
	}
}

interface WikipediaData {
	batchcomplete: string;
	continue: {
		continue: string;
		sroffset: number;
	};
	query: {
		search: {
			ns: number;
			pageid: number;
			size: number;
			snippet: string;
			timestamp: Date;
			title: string;
			wordcount: number;
		}[];
		searchinfo: {
			suggestion: string;
			suggestionsnippet: string;
			totalhits: number;
		};
	};
}
