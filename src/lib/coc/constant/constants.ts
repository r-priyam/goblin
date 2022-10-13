export const Troops: { [key: number]: string } = {
	// elixir troops
	0: 'Barbarian',
	1: 'Archer',
	2: 'Goblin',
	3: 'Giant',
	4: 'Wall Breaker',
	5: 'Balloon',
	6: 'Wizard',
	7: 'Healer',
	8: 'Dragon',
	9: 'P.E.K.K.A',
	23: 'Baby Dragon',
	24: 'Miner',
	53: 'Yeti',
	59: 'Electro Dragon',
	65: 'Dragon Rider',
	95: 'Electro Titan',

	// dark troops
	10: 'Minion',
	11: 'Hog Rider',
	12: 'Valkyrie',
	13: 'Golem',
	15: 'Witch',
	17: 'Lava Hound',
	22: 'Bowler',
	58: 'Ice Golem',
	82: 'Headhunter',

	// super troops
	26: 'Super Barbarian',
	27: 'Super Archer',
	28: 'Super Wall Breaker',
	29: 'Super Giant',
	55: 'Sneaky Goblin',
	57: 'Rocket Balloon',
	63: 'Inferno Dragon',
	64: 'Super Valkyrie',
	66: 'Super Witch',
	76: 'Ice Hound',
	80: 'Super Bowler',
	81: 'Super Dragon',
	83: 'Super Wizard',
	84: 'Super Minion',

	// special troops
	47: 'Royal Ghost',

	// siege machines
	51: 'Wall Wrecker',
	52: 'Battle Blimp',
	62: 'Stone Slammer',
	75: 'Siege Barracks',
	87: 'Log Launcher',
	91: 'Flame Flinger',
	92: 'Battle Drill'
};

export const Spells: { [key: number]: string } = {
	0: 'Lightning Spell',
	1: 'Healing Spell',
	2: 'Rage Spell',
	3: 'Jump Spell',
	5: 'Freeze Spell',
	9: 'Poison Spell',
	10: 'Earthquake Spell',
	11: 'Haste Spell',
	16: 'Clone Spell',
	17: 'Skeleton Spell',
	28: 'Bat Spell',
	35: 'Invisibility Spell',
	53: 'Recall Spell'
};

export const ErrorMessages: { [key: string]: string } = {
	500: 'Something went wrong when requesting from the API.',
	504: 'Request to API was timed out, Please try again!',
	503: 'Game API is under maintenance, try again after it ends.',
	429: 'Request was throttled, because amount of requests was above the threshold defined for the used API token.'
};

export const RawPosition: { [key: string]: string } = {
	leader: 'Leader',
	coLeader: 'Co-Leader',
	elder: 'Elder',
	member: 'Member'
};

export const RawWarFrequency: { [key: string]: string } = {
	always: 'Always',
	moreThanOncePerWeek: 'More than once per week',
	oncePerWeek: 'Once per week',
	lessThanOncePerWeek: 'Less than once per week',
	never: 'Never',
	unknown: 'Not set'
};

export const RawClanType: { [key: string]: string } = {
	open: 'Open',
	inviteOnly: 'Invite Only',
	closed: 'Closed'
};
