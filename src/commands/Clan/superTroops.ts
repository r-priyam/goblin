import { ApplyOptions } from '@sapphire/decorators';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { SuperTroops } from 'clashofclans.js';
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';

import type { GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { Clan } from 'clashofclans.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { SuperTroopEmotes } from '#lib/coc';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors, SelectMenuCustomIds } from '#utils/constants';
import { clanTagOption } from '#utils/functions/commandOptions';

@ApplyOptions<GoblinCommandOptions>({
	command: (builder) =>
		builder
			.setName('supertroops')
			.setDescription('Lists clan members active super troops')
			.addStringOption((option) => clanTagOption(option, { autoComplete: true })),
	commandMetaOptions: { idHints: ['991987141259309067', '992380615884296213'] }
})
export class SuperTroopsCommand extends GoblinCommand {
	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		await interaction.deferReply();

		const clanTag = await this.coc.clanHelper.dynamicTag(interaction);
		const clan = await this.coc.clanHelper.info(interaction, clanTag);

		const embed = await SuperTroopsCommand.getSuperTroops(clan);
		return interaction.editReply({
			embeds: [embed],
			components: [this.menuOptions(clan.tag)]
		});
	}

	private menuOptions(clanTag: string) {
		const superTroopsMenu = new StringSelectMenuBuilder()
			.setPlaceholder('Select a troop')
			.setCustomId(`${SelectMenuCustomIds.SuperTroop}-${clanTag}`)
			.addOptions(
				SuperTroops.map((troop) => ({
					label: troop,
					emoji: SuperTroopEmotes[troop],
					value: troop
				}))
			);

		return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(superTroopsMenu);
	}

	public static async getSuperTroops(clan: Clan, filterTroop?: string) {
		const members = await clan.fetchMembers();
		const superTroops = Object.fromEntries(
			SuperTroops.map((troop) => [`${SuperTroopEmotes[troop]} ${troop}`, [] as string[]])
		);

		for (const member of members) {
			for (const troop of member.superTroops) {
				if (troop.isActive) superTroops[`${SuperTroopEmotes[troop.name]} ${troop.name}`].push(member.name);
			}
		}

		const superTroopsEmbed = new EmbedBuilder() //
			.setColor(Colors.Indigo)
			.setAuthor({ iconURL: clan.badge.url, name: clan.name })
			.setTimestamp();

		if (filterTroop) {
			const data = superTroops[`${SuperTroopEmotes[filterTroop]} ${filterTroop}`];
			if (isNullishOrEmpty(data)) {
				superTroopsEmbed.setDescription(`No one has boosted ${filterTroop} 🥲`);
				return superTroopsEmbed;
			}

			superTroopsEmbed.addFields({
				name: filterTroop,
				value: data.join('\n'),
				inline: false
			});
			return superTroopsEmbed;
		}

		for (const [troop, data] of Object.entries(superTroops)) {
			if (isNullishOrEmpty(data)) continue;
			superTroopsEmbed.addFields({
				name: troop,
				value: data.join('\n'),
				inline: false
			});
		}

		if (superTroopsEmbed.data.fields?.length === 0)
			superTroopsEmbed.setDescription('No one has boosted any super troop 🥲');
		return superTroopsEmbed;
	}
}
