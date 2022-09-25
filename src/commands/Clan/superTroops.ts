import { ApplyOptions } from '@sapphire/decorators';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Clan, SUPER_TROOPS } from 'clashofclans.js';
import { CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { SuperTroopEmotes } from '#lib/coc';
import { GoblinCommand, GoblinCommandOptions } from '#lib/extensions/GoblinCommand';
import type { ClanOrPlayer } from '#lib/redis-cache/RedisCacheClient';
import { Colors } from '#utils/constants';
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
	public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
		await interaction.deferReply();
		let clanTag = interaction.options.getString('tag');

		if (isNullish(clanTag)) {
			const cachedClans = await this.redis.fetch<ClanOrPlayer[]>(`c-${interaction.user.id}`);
			if (isNullish(cachedClans)) {
				return interaction.editReply({
					content:
						'You have no clan linked into your profile. Please link any clan or provide the tag as 2nd argument!'
				});
			}

			clanTag = cachedClans[0].tag;
		}

		const clan = await this.coc.clanHelper.info(clanTag);
		const embed = await SuperTroopsCommand.getSuperTroops(clan);
		return interaction.editReply({ embeds: [embed], components: [this.menuOptions(clan.tag)] });
	}

	private menuOptions(clanTag: string) {
		const superTroopsMenu = new MessageSelectMenu()
			.setPlaceholder('Select a troop')
			.setCustomId(`SUPER_TROOP_MENU_${clanTag}`)
			.addOptions(SUPER_TROOPS.map((troop) => ({ label: troop, emoji: SuperTroopEmotes[troop], value: troop })));

		return new MessageActionRow().addComponents(superTroopsMenu);
	}

	public static async getSuperTroops(clan: Clan, filterTroop?: string) {
		const members = await clan.fetchMembers();
		const superTroops = Object.fromEntries(
			SUPER_TROOPS.map((troop) => [`${SuperTroopEmotes[troop]} ${troop}`, [] as string[]])
		);

		for (const member of members) {
			for (const troop of member.superTroops) {
				if (troop.isActive) superTroops[`${SuperTroopEmotes[troop.name]} ${troop.name}`].push(member.name);
			}
		}

		const superTroopsEmbed = new MessageEmbed() //
			.setColor(Colors.Indigo)
			.setAuthor({ iconURL: clan.badge.url, name: clan.name })
			.setTimestamp();

		if (filterTroop) {
			const data = superTroops[`${SuperTroopEmotes[filterTroop]} ${filterTroop}`];
			if (isNullishOrEmpty(data)) {
				superTroopsEmbed.description = `No one has boosted ${filterTroop} 🥲`;
				return superTroopsEmbed;
			}

			superTroopsEmbed.addFields({ name: filterTroop, value: data.join('\n'), inline: false });
			return superTroopsEmbed;
		}

		for (const [troop, data] of Object.entries(superTroops)) {
			if (isNullishOrEmpty(data)) continue;
			superTroopsEmbed.addFields({ name: troop, value: data.join('\n'), inline: false });
		}

		if (superTroopsEmbed.fields.length === 0)
			superTroopsEmbed.description = 'No one has boosted any super troop 🥲';
		return superTroopsEmbed;
	}
}
