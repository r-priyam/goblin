import { readFile } from 'node:fs/promises';
import { cpus, uptime, type CpuInfo } from 'node:os';
import process from 'node:process';
import { URL } from 'node:url';
import { hideLinkEmbed, hyperlink, time, TimestampStyles, userMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { version as sapphireVersion } from '@sapphire/framework';
import { roundNumber } from '@sapphire/utilities';
import { CommandInteraction, MessageEmbed, version } from 'discord.js';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { Colors } from '#root/lib/util/constants';
import { seconds } from '#utils/functions/time';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) => builder.setName('about').setDescription('Something about myself'),
	commandMetaOptions: { idHints: ['998801926315589672', '998831574449668126'] }
})
export class AboutCommand extends GoblinCommand {
	readonly #descriptionContent = [
		`I am a cute goblin created by ${userMention('292332992251297794')} to steal resources from around.`,
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

	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
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
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
