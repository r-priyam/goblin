import { readFile } from 'node:fs/promises';
import { cpus, uptime, type CpuInfo } from 'node:os';
import { hideLinkEmbed, hyperlink, time, TimestampStyles, userMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, version as sapphireVersion, type ChatInputCommand } from '@sapphire/framework';
import { roundNumber } from '@sapphire/utilities';
import { MessageEmbed, version } from 'discord.js';
import { Colors } from '#root/lib/util/constants';
import { seconds } from '#utils/functions/time';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Something about myself'
})
export class AboutCommand extends Command {
	readonly #descriptionContent = [
		`Check I am a cute goblin created by ${userMention('292332992251297794')} to steal resources from around.`,
		'If you have any suggestion/feedback for me then please send a DM to my creator 💙',
		"I am a private bot but if you want me then again feel free to contact my creator, she's kind enough to get you the invite link of mine. Do I do something? I don't think so but yeah your choice",
		`This bot uses the ${hyperlink(
			'Sapphire Framework',
			hideLinkEmbed('https://sapphirejs.dev')
		)} build on top of ${hyperlink('discord.js', hideLinkEmbed('https://discord.js.org'))} and uses ${hyperlink(
			'clashofclans.js',
			hideLinkEmbed('https://clashofclans.js.org/')
		)} to communicate with the clash api.`
	].join('\n');

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder //
					.setName(this.name)
					.setDescription(this.description)
					.setDMPermission(false),
			{
				idHints: ['998801926315589672', '998831574449668126']
			}
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });
		return interaction.editReply({ embeds: [await this.embed()] });
	}

	private async embed() {
		const titles = {
			stats: 'Statistics',
			uptime: 'Uptime',
			serverUsage: 'Server Usage'
		};
		const stats = await this.generalStatistics();
		const uptime = this.uptimeStatistics;
		const usage = this.usageStatistics;

		const fields = {
			stats: [
				//
				`• **Users**: ${stats.users}`,
				`• **Guilds**: ${stats.guilds}`,
				`• **Channels**: ${stats.channels}`,
				`• **Node.js**: ${stats.nodeJs}`,
				`• **Discord.js**: ${stats.discordjsVersion}`,
				`• **ClashofClans.js**: ${stats.clashofclansVersion}`,
				`• **Sapphire Framework**: ${sapphireVersion}`
			].join('\n'),
			uptime: [
				//
				`• **Host**: ${uptime.host}`,
				`• **Total**: ${uptime.total}`,
				`• **Client**: ${uptime.client}`
			].join('\n'),
			serverUsage: [
				//
				`• **CPU Load**: ${usage.cpuLoad}`,
				`• **Heap**: ${usage.ramUsed}MB (Total: ${usage.ramTotal}MB)`
			].join('\n')
		};

		return new MessageEmbed() //
			.setColor(Colors.Indigo)
			.setDescription(this.#descriptionContent)
			.setFields(
				{
					name: titles.stats,
					value: fields.stats,
					inline: true
				},
				{
					name: titles.uptime,
					value: fields.uptime
				},
				{
					name: titles.serverUsage,
					value: fields.serverUsage
				}
			);
	}

	private async generalStatistics() {
		const { dependencies } = JSON.parse(await readFile(new URL('../../../package.json', import.meta.url), 'utf8'));
		const { client } = this.container;
		return {
			channels: client.channels.cache.size,
			guilds: client.guilds.cache.size,
			nodeJs: process.version,
			users: client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0),
			discordjsVersion: `v${version}`,
			clashofclansVersion: `v${dependencies['clashofclans.js']}`
		};
	}

	private get uptimeStatistics() {
		const now = Date.now();
		const nowSeconds = roundNumber(now / 1000);
		return {
			client: time(seconds.fromMilliseconds(now - this.container.client.uptime!), TimestampStyles.RelativeTime),
			host: time(roundNumber(nowSeconds - uptime()), TimestampStyles.RelativeTime),
			total: time(roundNumber(nowSeconds - process.uptime()), TimestampStyles.RelativeTime)
		};
	}

	private get usageStatistics() {
		const usage = process.memoryUsage();
		return {
			cpuLoad: cpus().slice(0, 2).map(AboutCommand.formatCpuInfo.bind(null)).join(' | '),
			ramTotal: (usage.heapTotal / 1_048_576).toFixed(2),
			ramUsed: (usage.heapUsed / 1_048_576).toFixed(2)
		};
	}

	private static formatCpuInfo({ times }: CpuInfo) {
		return `${roundNumber(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10_000) / 100}%`;
	}
}
