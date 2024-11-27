import { DarkElixirTroops, ElixirTroops } from 'clashofclans.js';
import type { Player } from 'clashofclans.js';
import { inlineCode } from 'discord.js';
import { cluster } from 'radash';
import {
	BuilderBaseTroopEmotes,
	HeroEmotes,
	HeroPetEmotes,
	HomeBaseTroopEmotes,
	SiegeMachineEmotes,
	SpellEmotes,
	SuperTroopEmotes,
	HeroEquipment
} from '#lib/coc';

export class UnitsHelper {
	private readonly player: Player;

	public constructor(player: Player) {
		this.player = player;
	}

	public unit(type: 'BUILDER' | 'DARK' | 'ELIXIR' | 'EQUIPMENT' | 'HEROES' | 'PETS' | 'SIEGE' | 'SPELLS' | 'SUPER') {
		const data: { emoji: string; level: string }[] = [];

		switch (type) {
			case 'ELIXIR':
				for (const troop of this.player.homeTroops) {
					if (ElixirTroops.includes(troop.name)) {
						data.push({
							emoji: HomeBaseTroopEmotes[troop.name],
							level: this.formatInlineBlock(troop.level, troop.hallMaxLevel)
						});
					}
				}

				return this.formatValue(data);

			case 'DARK':
				for (const troop of this.player.homeTroops) {
					if (DarkElixirTroops.includes(troop.name)) {
						data.push({
							emoji: HomeBaseTroopEmotes[troop.name],
							level: this.formatInlineBlock(troop.level, troop.hallMaxLevel)
						});
					}
				}

				return this.formatValue(data);

			case 'SPELLS':
				for (const spell of this.player.spells) {
					data.push({
						emoji: SpellEmotes[spell.name],
						level: this.formatInlineBlock(spell.level, spell.hallMaxLevel)
					});
				}

				return this.formatValue(data);

			case 'SIEGE':
				for (const siege of this.player.siegeMachines) {
					data.push({
						emoji: SiegeMachineEmotes[siege.name],
						level: this.formatInlineBlock(siege.level, siege.hallMaxLevel)
					});
				}

				return this.formatValue(data);

			case 'HEROES':
				for (const hero of this.player.heroes) {
					data.push({
						emoji: HeroEmotes[hero.name],
						level: this.formatInlineBlock(hero.level, hero.hallMaxLevel)
					});
				}

				return this.formatValue(data);

			case 'EQUIPMENT':
				for (const equipment of this.player.heroEquipment) {
					data.push({
						emoji: HeroEquipment[equipment.name],
						level: this.formatInlineBlock(equipment.level, equipment.hallMaxLevel)
					});
				}

				return this.formatValue(data);

			case 'PETS':
				for (const pet of this.player.heroPets) {
					data.push({
						emoji: HeroPetEmotes[pet.name],
						level: this.formatInlineBlock(pet.level, pet.hallMaxLevel)
					});
				}

				return this.formatValue(data);

			case 'BUILDER':
				for (const troop of this.player.builderTroops) {
					data.push({
						emoji: BuilderBaseTroopEmotes[troop.name],
						level: this.formatInlineBlock(troop.level, troop.hallMaxLevel)
					});
				}

				return this.formatValue(data);
			case 'SUPER':
				for (const troop of this.player.superTroops) {
					data.push({
						emoji: SuperTroopEmotes[troop.name],
						level: this.formatInlineBlock(troop.level, troop.hallMaxLevel)
					});
				}

				return this.formatValue(data);
		}
	}

	protected formatValue(value: { emoji: string; level: string }[]) {
		const formattedValues = [];
		if (!value.length) {
			return;
		}

		const chunkedValues = cluster(value, 20);
		for (const chunk of chunkedValues) {
			let formattedValue = '';
			for (const [index_, data] of chunk.entries()) {
				let index = index_;
				index++;
				formattedValue += `${data.emoji} ${data.level} `;

				if (index % 4 === 0) {
					// check to keep only 4 items in row
					formattedValue += '\n';
				}
			}

			formattedValues.push(formattedValue);
		}

		return formattedValues;
	}

	protected formatInlineBlock(troopOrSpellLevel: number, troopOrSpellMaxLevel: number) {
		const level = String(troopOrSpellLevel);
		const maxLevel = String(troopOrSpellMaxLevel);

		if (troopOrSpellLevel < 10 && troopOrSpellMaxLevel >= 10) {
			return `${inlineCode(` ${level}/${maxLevel}`)}`;
		}

		if (troopOrSpellLevel < 10 && troopOrSpellMaxLevel < 10) {
			return `${inlineCode(` ${level}/${maxLevel} `)}`;
		}

		return `${inlineCode(`${level}/${maxLevel}`)}`;
	}
}
