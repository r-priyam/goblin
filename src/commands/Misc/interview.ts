import { channelMention, userMention } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommand, UserError } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { envParseString } from '@skyra/env-utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Colors } from '#utils/constants';

@ApplyOptions<Subcommand.Options>({
	subcommands: [
		{
			name: 'start',
			chatInputRun: 'startInterview'
		},
		{
			name: 'close',
			chatInputRun: 'closeInterview'
		}
	],
	description: 'Commands related to interview channel'
})
export class InterviewCommand extends Subcommand {
	#welcomeMessage = `Thank you for your interest in joining EYG!
Please answer the questions below and post a screenshot of your base.
Our clans have 8 hours to review your answers & ask further questions. After this, you will be offered a place. If now is not a good time to start please tell us.

1. What State/Country or time zone are you in?
2. Why are you leaving your old/current clan?
3. How often do you want to war? Do you finish clan games?
4. Are you currently in war or in clan games? Are there any reasons you can not move to a new clan immediately?
5. Do you have any specific requirements from your new clan? For example, hero(s) down war, players from your time zone?
6. Why do you want to join EYG? What can you bring your new clan?
7. What CWL league(s) do you have experience in?`;

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.setDMPermission(false)
					.addSubcommand((command) =>
						command
							.setName('start')
							.setDescription('Starts the interview for an user')
							.addUserOption((option) =>
								option //
									.setName('user')
									.setDescription('The user to start interview with')
									.setRequired(true)
							)
					)
					.addSubcommand((command) =>
						command
							.setName('close')
							.setDescription('Closes the ongoing interview in channel')
							.addStringOption((option) =>
								option //
									.setName('reason')
									.setDescription('Reason to close the interview')
									.setRequired(true)
							)
					),
			{ idHints: ['979827529579921458', '980131952327802930'] }
		);
	}

	public async startInterview(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		this.canPerformInterviewOperations(interaction.member);

		const member = interaction.options.getMember('user', true);
		const allowedPermissions = [
			PermissionFlagsBits.SendMessages,
			PermissionFlagsBits.ReadMessageHistory,
			PermissionFlagsBits.AddReactions,
			PermissionFlagsBits.EmbedLinks,
			PermissionFlagsBits.AttachFiles,
			PermissionFlagsBits.ViewChannel,
			PermissionFlagsBits.UseExternalEmojis
		];

		const channel = await interaction.guild.channels.create(`${member.displayName}-interview`, {
			reason: `Automated interview channel creation by ${interaction.member.displayName}`,
			type: 'GUILD_TEXT',
			parent: envParseString('EYG_INTERVIEW_CHANNEL_PARENT'),
			permissionOverwrites: [
				{ id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
				{
					id: envParseString('EYG_RECRUITER_ROLE'),
					allow: [...allowedPermissions, PermissionFlagsBits.ManageRoles]
				},
				{ id: member.id, allow: allowedPermissions }
			]
		});

		// remove fresh-spawn role and add recruiter role
		await member.roles.remove(envParseString('EYG_FRESH_SPAWN_ROLE'));
		await member.roles.add(envParseString('EYG_RECRUIT_ROLE_ID'));

		await channel.send({
			content: userMention(member.id),
			embeds: [new MessageEmbed().setColor(Colors.LightGreen).setDescription(this.#welcomeMessage)]
		});

		return interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setTitle('Success')
					.setDescription(`Successfully created ${channelMention(channel.id)}`)
					.setColor(Colors.Green)
			]
		});
	}

	public async closeInterview(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		this.canPerformInterviewOperations(interaction.member);

		const reason = interaction.options.getString('reason', true);
		const { channel, member } = interaction;

		const messages: string[] = [];
		await channel?.messages.fetch({ limit: 100 }, { force: true }).then((data) => {
			for (const message of [...data.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp)) {
				if (message.embeds.length) {
					messages.push(
						`${message.createdAt} » ${message.author.username} » ${message.embeds[0].description}`
					);
				}

				if (message.content.length)
					messages.push(`${message.createdAt} » ${message.author.username} » ${message.content}`);
			}
		});

		let gistId: string;
		try {
			gistId = await this.createInterviewGist(channel!.name, messages.join('\n'));
		} catch {
			return interaction.editReply({ content: 'Something went wrong, please try again!' });
		}

		const reportingChannel = (await this.client.channels.fetch(
			envParseString('EYG_REPORTING_CHANNEL')
		)) as TextChannel;

		const successData = {
			embeds: [
				new MessageEmbed()
					.setDescription(
						`Backup file for ${channel?.name} is saved at https://gist.github.com/robo-goblin/${gistId}`
					)
					.setColor(Colors.Indigo)
			]
		};
		await channel?.delete(`Interview channel deleted by ${member.displayName}, reason - ${reason}`);
		return reportingChannel.send(successData);
	}

	private canPerformInterviewOperations(member: GuildMember) {
		if (
			!member.roles.cache.hasAny(envParseString('EYG_RECRUIT_ROLE_ID'), envParseString('EYG_ADMINISTRATOR_ROLE'))
		) {
			throw new UserError({ identifier: 'user-not-allowed', message: "You aren't allowed to use this command" });
		}
	}

	private async createInterviewGist(fileName: string, content: string) {
		const body = { public: false, files: {} };
		Object.assign(body.files, { [`${fileName}.txt`]: { content } });

		const response = await fetch('https://api.github.com/gists', {
			method: 'POST',
			headers: {
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'Goblin Channel Close',
				'Authorization': `token ${envParseString('GITHUB_TOKEN')}`
			},
			body: JSON.stringify(body)
		});

		// TODO: Create task here to handle the rate limit. I doubt it
		// will occur here but if in case it does...
		if (response.status >= 200 || response.status < 300) {
			const data: { id: string } = await response.json();
			return data.id;
		}
		throw new UserError({
			identifier: 'http-error',
			message: 'Something went wrong while taking the backup of interview channel, please try again!'
		});
	}
}
