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
	CWLEvent = 'cwl-event-config-modal',
	ClanEmbedRequirements = 'clan-embed-requirements',
	StartClanEmbed = 'start-clan-embed-modal'
}

export const enum ModalInputCustomIds {
	ElevenRequirements = 'eleven-requirements-input',
	EventEndRolePing = 'event-end-role-ping',
	EventName = 'event-name',
	EventRegistrationChannel = 'event-registration-channel',
	EventStartRolePing = 'event-start-role-ping',
	FourteenRequirements = 'fourteen-requirements-input',
	StartClanEmbedColor = 'start-clan-embed-color-input',
	StartClanEmbedLeader = 'start-clan-embed-leader-input',
	TenRequirements = 'ten-requirements-input',
	ThirteenRequirements = 'thirteen-requirements-input',
	TwelveRequirements = 'twelve-requirements-input'
}

export const enum ButtonCustomIds {
	CWLEventCreate = 'cwl-event-create',
	CWLEventRegister = 'cwl-event-register',
	CWLEventUnregister = 'cwl-event-unregister',
	ClanEmbedRequirement = 'add-clan-requirement-button',
	CustomEventCreate = 'custom-event-create',
	EventCancel = 'event-cancel',
	EventSubmit = 'event-submit'
}

export const enum SelectMenuCustomIds {
	CWLEventConfig = 'cwl-event-config-menu',
	Nickname = 'nickname-menu',
	SuperTroop = 'super-troop-menu'
}

export const enum SelectMenuOptionsValue {
	EventEndRolePing = 'event-end-role-ping',
	EventName = 'event-name',
	EventRegistrationChannel = 'event-registration-channel',
	EventStartRolePing = 'event-start-role-ping'
}

export const enum ErrorIdentifiers {
	BadParameter = 'BadParameter',
	CWLEventProcess = 'CwlEventProcess',
	ClanHelper = 'ClanHelper',
	DatabaseError = 'DatabaseError',
	DiscordAPIError = 'DiscordAPIError',
	HttpError = 'HTTPError',
	MissingPermissions = 'UserMissingPermission',
	PlayerHelper = 'PlayerHelper',
	Unknown = 'UNKNOWN',
	WrongTag = 'WrongTag'
}

export const enum RedisKeys {
	Clan = 'c',
	ClanAlias = 'clan-aliases',
	Links = 'links',
	Player = 'p'
}

export const enum EventConfigDefaultValues {
	NotRequired = '_Not Configured_',
	Required = '_Not Configured (Required)_'
}
