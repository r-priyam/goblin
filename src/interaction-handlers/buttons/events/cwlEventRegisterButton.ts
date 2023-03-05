import { Time } from '@sapphire/cron';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, UserError } from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { Util } from 'clashofclans.js';
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, bold } from 'discord.js';

import type { ButtonInteraction, SelectMenuComponentOptionData } from 'discord.js';

import { TownHallEmotes } from '#lib/coc';
import { Prompter } from '#utils/classes/prompter';
import { ButtonCustomIds, Colors, ErrorIdentifiers, RedisKeys, SelectMenuCustomIds } from '#utils/constants';
import { seconds } from '#utils/functions/time';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.editReply({
			content: result.content,
			embeds: result.embeds,
			components: result.components
		});
	}

	public override async parse(interaction: ButtonInteraction) {
		if (
			!(
				interaction.customId.startsWith(ButtonCustomIds.CWLEventRegister) ||
				interaction.customId.startsWith(ButtonCustomIds.CWLEventUnregister)
			)
		) {
			return this.none();
		}

		await interaction.deferReply({ ephemeral: true });
		const eventId = interaction.customId.split('-').pop()!;

		if (interaction.customId.startsWith(ButtonCustomIds.CWLEventUnregister)) {
			return this.handleUnregister(interaction);
		}

		const registerMenuOptions = await this.handleRegister(interaction.user.id, eventId);

		return this.some({
			content: null,
			embeds: [],
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(`${SelectMenuCustomIds.CWLEventRegister}_${eventId}`)
						.setPlaceholder('Select a player to register')
						.addOptions(registerMenuOptions)
				)
			]
		});
	}

	private async handleRegister(userId: string, eventId: string) {
		let menuOptions: SelectMenuComponentOptionData[] | null;

		menuOptions = await this.redis.fetch(RedisKeys.CWLEventRegistration, userId);

		if (!menuOptions) {
			const linkedPlayers = await this.sql<{ playerTag: string; registered: boolean }[]>`
                SELECT p.player_tag, (ca.id IS NOT NULL) as registered
                FROM players p
                         LEFT JOIN cwl_applications ca
                                   on p.player_tag = ca.player_tag AND
                                      (ca.event_id = ${eventId} OR ca.event_id IS NULL)
                WHERE p.user_id = ${userId}
                LIMIT 25`;

			if (isNullishOrEmpty(linkedPlayers)) {
				throw new UserError({
					identifier: ErrorIdentifiers.CWLEventProcess,
					message: "You don't have any accounts linked. Please link one to carry with the registration"
				});
			}

			const linkedData = Object.assign(
				{},
				...linkedPlayers.map((data) => ({ [data.playerTag]: data.registered }))
			);
			const playersData = await Util.allSettled(
				Object.keys(linkedData).map((tag) => this.container.coc.getPlayer(tag))
			);
			const players = playersData.filter((player) => player.townHallLevel > 8);

			if (isNullishOrEmpty(players)) {
				throw new UserError({
					identifier: ErrorIdentifiers.CWLEventProcess,
					message: bold(
						"It appears that you don't have any account linked above TH8. To register you must have an account linked which is above TH8"
					)
				});
			}

			menuOptions = players.map((player) => ({
				label: `${linkedData[player.tag] ? '✅' : '❌'} ${player.name}`,
				value: `${player.tag}_${player.townHallLevel}_${player.heroes
					.map((hero) => (hero.isBuilderBase ? undefined : hero.level))
					.filter(Boolean)
					.join('_')}`,
				emoji: TownHallEmotes[player.townHallLevel]
			}));

			await this.redis.insertWithExpiry(
				RedisKeys.CWLEventRegistration,
				userId,
				menuOptions,
				seconds.fromMilliseconds(Time.Minute * 30)
			);
		}

		return menuOptions;
	}

	private async handleUnregister(interaction: ButtonInteraction) {
		const prompter = new Prompter(
			interaction,
			`Are you sure that you want to unregister from this event? ${bold(
				'Confirming this will delete all your data saved for this event.'
			)}`
		);

		const prompt = await prompter.prompt();

		if (!prompt) {
			return this.some({
				content:
					'Uh, seems you changed your mind else I was about to delete your all the data, better luck next time to me 😏',
				embeds: [],
				components: []
			});
		}

		const result = await this.sql`DELETE
                                      FROM cwl_applications
                                      WHERE discord_id = ${interaction.user.id}
                                      RETURNING id`;
		await this.redis.delete(RedisKeys.CWLEventRegistration, interaction.user.id);

		if (isNullishOrEmpty(result)) {
			return this.some({
				content:
					"Well, good try, you don't have any data to delete from this event. I am not that smart but I am smart to catch it.",
				embeds: [],
				components: []
			});
		}

		return this.some({
			content: null,
			embeds: [
				new EmbedBuilder()
					.setTitle('Success')
					.setDescription(
						'Successfully deleted your all data which was registered. I still hope that you will play in this event 🙂'
					)
					.setColor(Colors.Green)
			],
			components: []
		});
	}
}
