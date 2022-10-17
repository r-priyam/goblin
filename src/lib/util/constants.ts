import { URL } from 'node:url';

export const RootDir = new URL('../../../', import.meta.url);
export const SrcDir = new URL('src/', RootDir);

export const enum Colors {
	White = 0xe7e7e8,
	Amber = 0xffc107,
	Blue = 0x2196f3,
	BlueGrey = 0x607d8b,
	Brown = 0x795548,
	Cyan = 0x00bcd4,
	DeepOrange = 0xff5722,
	DeepPurple = 0x673ab7,
	Green = 0x4caf50,
	Grey = 0x9e9e9e,
	Indigo = 0x3f51b5,
	LightBlue = 0x03a9f4,
	LightGreen = 0x8bc34a,
	Lime = 0xcddc39,
	Orange = 0xff9800,
	Pink = 0xe91e63,
	Purple = 0x9c27b0,
	Red = 0xf44336,
	Teal = 0x009688,
	Yellow = 0xffeb3b
}

export const enum Emotes {
	Error = '<:Error:1013836216174657576>',
	Success = '<:Success:1013836120397709432>',
	Typing = '<a:typing:597589448607399949>'
}

export const enum ModalCustomIds {
	ClanEmbedRequirements = 'clan-embed-requirements',
	StartClanEmbed = 'start-clan-embed-modal'
}

export const enum ModalInputCustomIds {
	ElevenRequirements = 'eleven-requirements-input',
	FourteenRequirements = 'fourteen-requirements-input',
	StartClanEmbedColor = 'start-clan-embed-color-input',
	StartClanEmbedLeader = 'start-clan-embed-leader-input',
	TenRequirements = 'ten-requirements-input',
	ThirteenRequirements = 'thirteen-requirements-input',
	TwelveRequirements = 'twelve-requirements-input'
}

export const enum ButtonCustomIds {
	ClanEmbedRequirement = 'add-clan-requirement-button'
}

export const enum SelectMenuCustomIds {
	Nickname = 'nickname-menu',
	SuperTroop = 'super-troop-menu'
}

export const enum ErrorIdentifiers {
	BadParameter = 'BadParameter',
	ClanHelper = 'ClanHelper',
	DatabaseError = 'DatabaseError',
	DiscordAPIError = 'DiscordAPIError',
	HttpError = 'HTTPError',
	MissingPermissions = 'UserMissingPermission',
	PlayerHelper = 'PlayerHelper',
	Unknown = 'UNKNOWN',
	WrongTag = 'WrongTag'
}

export const enum CacheIdentifiers {
	Clan = 'c',
	ClanAliasCachees = 'clan-aliases',
	Links = 'links',
	Player = 'p'
}
