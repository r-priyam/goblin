import { ApplyOptions } from '@sapphire/decorators';
import type { ChatInputCommand } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Clan, SUPER_TROOPS } from 'clashofclans.js';
import { ActionRowBuilder, EmbedBuilder, EmbedField, SelectMenuBuilder } from 'discord.js';

import { clanHelper, SuperTroopEmotes } from '#lib/coc';
import { GoblinCommand } from '#lib/extensions/GoblinCommand';
import { Colors } from '#utils/constants';
import { ClanOrPlayer, redis } from '#utils/redis';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Lists clan members active super troops'
})
export class SuperTroopsCommand extends GoblinCommand {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand(
			(builder) =>
				builder
					.setName(this.name)
					.setDescription(this.description)
					.addStringOption((option) =>
						option //
							.setName('tag')
							.setDescription('Tag of the clan')
							.setRequired(false)
							.setAutocomplete(true)
					),
			{
				idHints: ['991987141259309067', '992380615884296213']
			}
		);
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction<'cached'>) {
		await interaction.deferReply();
		let clanTag = interaction.options.getString('tag');

		if (isNullish(clanTag)) {
			const cachedClans = await redis.get<ClanOrPlayer[]>(`c-${interaction.user.id}`);
			if (isNullish(cachedClans)) {
				return interaction.editReply({
					content: 'You have no clan linked into your profile. Please link any clan or provide the tag as 2nd argument!'
				});
			}

			clanTag = cachedClans[0].tag;
		}

		const clan = await clanHelper.info(clanTag);
		const embed = await SuperTroopsCommand.getSuperTroops(clan);
		return interaction.editReply({ embeds: [embed], components: [this.menuOptions(clan.tag)] });
	}

	private menuOptions(clanTag: string) {
		const superTroopsMenu = new SelectMenuBuilder()
			.setPlaceholder('Select a troop')
			.setCustomId(`SUPER_TROOP_MENU_${clanTag}`)
			.addOptions(SUPER_TROOPS.map((troop) => ({ label: troop, emoji: SuperTroopEmotes[troop], value: troop })));

		return new ActionRowBuilder().addComponents(superTroopsMenu);
	}

	public static async getSuperTroops(clan: Clan, filterTroop?: string) {
		const members = await clan.fetchMembers();
		const superTroops = Object.fromEntries(SUPER_TROOPS.map((troop) => [`${SuperTroopEmotes[troop]} ${troop}`, [] as string[]]));

		for (const member of members) {
			for (const troop of member.superTroops) {
				if (troop.isActive) superTroops[`${SuperTroopEmotes[troop.name]} ${troop.name}`].push(member.name);
			}
		}

		const SuperTroopsEmbed = new EmbedBuilder() //
			.setColor(Colors.Indigo)
			.setAuthor({ iconURL: clan.badge.url, name: clan.name })
			.setTimestamp();

		const TroopFields: EmbedField[] = [];

		if (filterTroop) {
			const data = superTroops[`${SuperTroopEmotes[filterTroop]} ${filterTroop}`];
			if (isNullishOrEmpty(data)) {
				SuperTroopsEmbed.setDescription(`No one has boosted ${filterTroop} 🥲`);
				return SuperTroopsEmbed;
			}

			TroopFields.push({ name: filterTroop, value: data.join('\n'), inline: false });
			SuperTroopsEmbed.addFields([{ name: filterTroop, value: data.join('\n'), inline: false }]);
			return SuperTroopsEmbed;
		}

		for (const [troop, data] of Object.entries(superTroops)) {
			if (isNullishOrEmpty(data)) continue;
			TroopFields.push({ name: troop, value: data.join('\n'), inline: false });
		}

		SuperTroopsEmbed.addFields(TroopFields);

		if (SuperTroopsEmbed.data.fields?.length === 0) SuperTroopsEmbed.setDescription('No one has boosted any super troop 🥲');
		return SuperTroopsEmbed;
	}
}
