import { ApplyOptions } from '@sapphire/decorators';
import { UserError } from '@sapphire/framework';
import { Util } from 'clashofclans.js';
import { PermissionFlagsBits, TextInputStyle } from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	bold
} from 'discord.js';
import { ValidateTag } from '#lib/decorators/ValidateTag';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import { Colors, Emotes, ErrorIdentifiers, ModalCustomIds, ModalInputCustomIds } from '#utils/constants';
import { automationMemberCheck } from '#utils/functions/automationMemberCheck';
import { addTagOption } from '#utils/functions/commandOptions';

type StartType = 'clanEmbed' | 'clanLevelUp' | 'warImage' | 'warStreakAnnouncement';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('start')
			.setDescription('Starts the selected automation in the channel')
			.addStringOption((option) =>
				option
					.setName('type')
					.setDescription('The type of automation to start')
					.addChoices(
						{ name: 'Clan Embed 📊', value: 'clanEmbed' },
						{ name: 'War Image 🎞️', value: 'warImage' },
						{ name: 'War Streak Announcement 📢', value: 'warStreakAnnouncement' },
						{ name: 'Clan Level Up 🆙', value: 'clanLevelUp' }
					)
					.setRequired(true)
			)
			.addStringOption((option) =>
				addTagOption(option, { description: 'Tag of the clan to start automation for', required: true })
			),
	requiredMemberPermissions: PermissionFlagsBits.ManageMessages,
	commandMetaOptions: { idHints: ['1010855609043787796', '1013039770429034547'] },
	preconditions: ['StartRequiredPermissions']
})
export class StartCommand extends GoblinCommand {
	@ValidateTag({ prefix: 'clan' })
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		automationMemberCheck(interaction.guildId, interaction.member);

		const startType = interaction.options.getString('type', true) as StartType;
		return this[startType](interaction);
	}

	private async clanEmbed(interaction: ChatInputCommandInteraction<'cached'>) {
		const clanTag = interaction.options.getString('tag', true);

		const embedModal = new ModalBuilder()
			.setTitle('Clan Embed Start Form')
			.setCustomId(`${ModalCustomIds.StartClanEmbed}-${Util.formatTag(clanTag)}`)
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedLeader)
						.setLabel("What's the clan leader discord id?")
						.setStyle(TextInputStyle.Short)
						.setMinLength(16)
						.setMaxLength(22)
						.setRequired(true)
				),
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder() //
						.setCustomId(ModalInputCustomIds.StartClanEmbedColor)
						.setLabel('Enter the embed color. For example: #FF5733')
						.setStyle(TextInputStyle.Short)
						.setMinLength(6)
						.setMaxLength(7)
						.setRequired(true)
				)
			);

		return interaction.showModal(embedModal);
	}

	// To-Do: Give users a option to set-up war result types someday?!?!?!?!?!
	private async warImage(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const clan = await this.coc.clanHelper.info(interaction, interaction.options.getString('tag', true));

		if (!clan.isWarLogPublic) {
			throw new UserError({
				identifier: ErrorIdentifiers.ClanHelper,
				message: `Clan war log should be ${bold('PUBLIC')} in order to enable war image posting`
			});
		}

		try {
			await this.sql`INSERT INTO war_image_poster (clan_tag, guild_id, channel_id)
                           VALUES (${clan.tag}, ${interaction.guildId}, ${interaction.channelId})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `War Image Poster for **${clan.name} (${clan.tag})** is already running in this server`
				});
			}
		}

		return interaction.editReply({
			embeds: [
				new EmbedBuilder() //
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Successfully started War Image Poster for ${clan.name} (${clan.tag})`)
					.setColor(Colors.Green)
			]
		});
	}

	private async warStreakAnnouncement(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const clan = await this.coc.clanHelper.info(interaction, interaction.options.getString('tag', true));

		try {
			await this.sql`INSERT INTO war_win_streak_announcement (clan_tag, current_win_streak, guild_id, channel_id)
						   VALUES (${clan.tag}, ${clan.warWinStreak}, ${interaction.guildId}, ${interaction.channelId})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `War Streak Announcement for **${clan.name} (${clan.tag})** is already running in this server`
				});
			}
		}

		return interaction.editReply({
			embeds: [
				new EmbedBuilder() //
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Successfully started War Streak Announcement for ${clan.name} (${clan.tag})`)
					.setColor(Colors.Green)
			]
		});
	}

	private async clanLevelUp(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply({ ephemeral: true });

		const clan = await this.coc.clanHelper.info(interaction, interaction.options.getString('tag', true));

		try {
			await this.sql`INSERT INTO clan_level_up (clan_tag, guild_id, channel_id, current_level)
						   VALUES (${clan.tag}, ${interaction.guildId}, ${interaction.channelId}, ${clan.level})`;
		} catch (error) {
			if (error instanceof this.sql.PostgresError && error.code === '23505') {
				throw new UserError({
					identifier: ErrorIdentifiers.DatabaseError,
					message: `Clan Level Announcement for **${clan.name} (${clan.tag})** is already running in this server`
				});
			}

			throw error;
		}

		return interaction.editReply({
			embeds: [
				new EmbedBuilder() //
					.setTitle(`${Emotes.Success} Success`)
					.setDescription(`Successfully started Clan Level Announcement for ${clan.name} (${clan.tag})`)
					.setColor(Colors.Green)
			]
		});
	}
}
