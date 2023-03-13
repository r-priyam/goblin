import { ApplyOptions } from '@sapphire/decorators';
import { container, UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { Util } from 'clashofclans.js';
import { PermissionFlagsBits, RESTJSONErrorCodes, Routes } from 'discord-api-types/v10';
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, bold, inlineCode, userMention } from 'discord.js';

import type { GoblinPlayer } from '#lib/coc';
import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ChatInputCommandInteraction, HTTPError } from 'discord.js';

import { TownHallEmotes } from '#lib/coc';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors, Emotes, ErrorIdentifiers, SelectMenuCustomIds } from '#utils/constants';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('nickname')
			.setDescription('Sets the nickname of a member')
			.addUserOption((option) =>
				option //
					.setName('user')
					.setDescription('The user to get information for')
					.setRequired(true)
			),
	requiredMemberPermissions: PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers,
	commandMetaOptions: { idHints: ['1031134398625628210', '1031212344967172217'] }
})
export class NicknameCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();

		const member = interaction.options.getMember('user')!;
		const data = await this.sql<{ playerTag: string }[]>`SELECT player_tag
                                                             FROM players
                                                             WHERE user_id = ${member.id} LIMIT 20`;

		if (isNullishOrEmpty(data)) {
			throw new UserError({
				identifier: ErrorIdentifiers.DatabaseError,
				message: bold(
					`Well, I can't find any account for ${userMention(
						member.id
					)} in the database. Please ask the user to link any player to their account or ${inlineCode(
						'forcelink'
					)} an account`
				)
			});
		}

		const playersData = await Util.allSettled(data.map((tags) => this.container.coc.getPlayer(tags.playerTag)));

		if (playersData.length === 1) {
			await NicknameCommand.updateNickname(
				interaction.guildId,
				member.id,
				this.generateNickname(playersData[0]),
				`Nickname changed by using nicknmae command. Action by ${interaction.user.username}`
			);
			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle(`${Emotes.Success} Success`)
						.setDescription(`Successfully changed ${userMention(member.id)} nickname`)
						.setColor(Colors.Green)
				]
			});
		}

		const nicknameMenu = new StringSelectMenuBuilder()
			.setPlaceholder('Select nickname')
			.setCustomId(`${SelectMenuCustomIds.Nickname}-${member.id}`)
			.addOptions(
				playersData.map((player) => ({
					label: this.generateNickname(player),
					emoji: TownHallEmotes[player.townHallLevel],
					value: this.generateNickname(player)
				}))
			);

		return interaction.editReply({
			content: bold('User has multiple accounts linked, please select which nickname to set'),
			components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(nicknameMenu)]
		});
	}

	public static async updateNickname(guildId: string, memberId: string, nick: string, reason: string) {
		const result = await Result.fromAsync<unknown, HTTPError>(async () =>
			container.client.rest.patch(Routes.guildMember(guildId, memberId), {
				body: { nick },
				headers: { 'X-Audit-Log-Reason': reason }
			})
		);

		if (result.isErr()) {
			const error = result.unwrapErr();
			if (error.status === RESTJSONErrorCodes.MissingPermissions) {
				throw new UserError({
					identifier: ErrorIdentifiers.DiscordAPIError,
					message: 'I am missing permissions to perform this action'
				});
			}
		}
	}

	private generateNickname(player: GoblinPlayer) {
		const nick = `${player.name} | ${player.clan?.name ?? 'No Clan'}`;
		return nick.length <= 32 ? nick : `${nick.slice(0, 30)}..`;
	}
}
