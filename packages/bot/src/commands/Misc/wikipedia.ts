import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import { stripHtml } from 'string-strip-html';

import { Colors } from '#utils/constants';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Search wikipedia for a keyword'
})
export class WikipediaCommand extends Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('keyword')
							.setDescription('The keyword to search')
							.setRequired(true)
					)
					.setDMPermission(false),
			{ idHints: ['987351901655945326', '987409434462519337'] }
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });
		const keyword = interaction.options.getString('keyword', true);

		const response = await fetch(
			`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&format=json&origin=*&srlimit=20&srsearch=${keyword}`
		).catch(() => null);

		const data: WikipediaData = await response?.json().catch(() => null);

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
		sroffset: number;
		continue: string;
	};
	query: {
		searchinfo: {
			totalhits: number;
			suggestion: string;
			suggestionsnippet: string;
		};
		search: {
			ns: number;
			title: string;
			pageid: number;
			size: number;
			wordcount: number;
			snippet: string;
			timestamp: Date;
		}[];
	};
}
