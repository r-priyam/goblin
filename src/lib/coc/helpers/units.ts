import { inlineCode } from '@discordjs/builders';
import type { Player } from 'clashofclans.js';
import { DARK_ELIXIR_TROOPS, ELIXIR_TROOPS } from 'clashofclans.js';

import { BuilderBaseTroopEmotes, HeroEmotes, HeroPetEmotes, HomeBaseTroopEmotes, SiegeMachineEmotes, SpellEmotes, SuperTroopEmotes } from '#lib/coc';

export class PlayerUnits {
	private player: Player;

	public constructor(player: Player) {
		this.player = player;
	}

	public unit(type: 'ELIXIR' | 'DARK' | 'SPELLS' | 'SIEGE' | 'HEROES' | 'PETS' | 'BUILDER' | 'SUPER') {
		const data: { emoji: string; level: string }[] = [];

		switch (type) {
			case 'ELIXIR':
				for (const troop of this.player.homeTroops) {
					if (ELIXIR_TROOPS.includes(troop.name)) {
						data.push({ emoji: HomeBaseTroopEmotes[troop.name], level: this.formatInlineBlock(troop.level, troop.hallMaxLevel) });
					}
				}
				return this.formatValue(data);

			case 'DARK':
				for (const troop of this.player.homeTroops) {
					if (DARK_ELIXIR_TROOPS.includes(troop.name)) {
						data.push({ emoji: HomeBaseTroopEmotes[troop.name], level: this.formatInlineBlock(troop.level, troop.hallMaxLevel) });
					}
				}
				return this.formatValue(data);

			case 'SPELLS':
				for (const spell of this.player.spells) {
					data.push({ emoji: SpellEmotes[spell.name], level: this.formatInlineBlock(spell.level, spell.hallMaxLevel) });
				}
				return this.formatValue(data);

			case 'SIEGE':
				for (const siege of this.player.siegeMachines) {
					data.push({ emoji: SiegeMachineEmotes[siege.name], level: this.formatInlineBlock(siege.level, siege.hallMaxLevel) });
				}
				return this.formatValue(data);

			case 'HEROES':
				for (const hero of this.player.heroes) {
					data.push({ emoji: HeroEmotes[hero.name], level: this.formatInlineBlock(hero.level, hero.hallMaxLevel) });
				}
				return this.formatValue(data);

			case 'PETS':
				for (const pet of this.player.heroPets) {
					data.push({ emoji: HeroPetEmotes[pet.name], level: this.formatInlineBlock(pet.level, pet.hallMaxLevel) });
				}
				return this.formatValue(data);

			case 'BUILDER':
				for (const troop of this.player.builderTroops) {
					data.push({ emoji: BuilderBaseTroopEmotes[troop.name], level: this.formatInlineBlock(troop.level, troop.hallMaxLevel) });
				}
				return this.formatValue(data);
			case 'SUPER':
				for (const troop of this.player.superTroops) {
					data.push({ emoji: SuperTroopEmotes[troop.name], level: this.formatInlineBlock(troop.level, troop.hallMaxLevel) });
				}
				return this.formatValue(data);
		}
	}

	protected formatValue(value: { emoji: string; level: string }[]) {
		let lineBreak = 0;
		let formattedValue = '';
		if (value.length > 0) {
			for (const data of value) {
				lineBreak += 1;
				formattedValue += `${data.emoji} ${data.level}`;

				if (lineBreak === 4) {
					// check to keep only 4 items in row
					lineBreak = 0;
					formattedValue += '\n';
				}
			}
		}
		return formattedValue;
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
