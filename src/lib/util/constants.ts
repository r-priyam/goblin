import { URL } from 'node:url';

export const RootDir = new URL('../../../', import.meta.url);
export const SrcDir = new URL('src/', RootDir);
export const MetaDir = new URL('meta/', RootDir);

export enum Colors {
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

export enum Emotes {
	Error = '<:Error:1013836216174657576>',
	Success = '<:Success:1013836120397709432>',
	Typing = '<a:typing:597589448607399949>'
}

export enum ModalCustomIds {
	CWLEvent = 'cwl-event-config-modal',
	ClanEmbedRequirements = 'clan-embed-requirements',
	StartClanEmbed = 'start-clan-embed-modal'
}

export enum ModalInputCustomIds {
	ElevenRequirements = 'eleven-requirements-input',
	EventEndRolePing = 'event-end-role-ping',
	EventName = 'event-name',
	EventRegistrationChannel = 'event-registration-channel',
	EventStartRolePing = 'event-start-role-ping',
	FifteenRequirements = 'fifteen-requirements-input',
	FourteenRequirements = 'fourteen-requirements-input',
	StartClanEmbedColor = 'start-clan-embed-color-input',
	StartClanEmbedLeader = 'start-clan-embed-leader-input',
	ThirteenRequirements = 'thirteen-requirements-input',
	TwelveRequirements = 'twelve-requirements-input'
}

export enum ButtonCustomIds {
	CWLEventCreate = 'cwl-event-create',
	CWLEventEndExport = 'cwl-event-end-export',
	CWLEventRegister = 'cwl-event-register',
	CWLEventUnregister = 'cwl-event-unregister',
	CWLEventUserRegisterCancel = 'cwl-event-u-register-cancel',
	CWLEventUserRegisterSubmit = 'cwl-event--u-register-submit',
	CWLOptInDayFive = 'cwl-opt-in-day-five',
	CWLOptInDayFour = 'cwl-opt-in-day-four',
	CWLOptInDayOne = 'cwl-opt-in-day-one',
	CWLOptInDaySeven = 'cwl-opt-in-day-seven',
	CWLOptInDaySix = 'cwl-opt-in-day-six',
	CWLOptInDayThree = 'cwl-opt-in-day-three',
	CWLOptInDayTwo = 'cwl-opt-in-day-two',
	CWLWarCasual = 'cwl-war-casual',
	CWLWarSerious = 'cwl-war-serious',
	ClanEmbedRequirement = 'add-clan-requirement-button',
	CustomEventCreate = 'custom-event-create',
	EventCancel = 'event-cancel',
	EventSubmit = 'event-submit',
	WarImageAbort = 'war-image-abort',
	WarImageConfirm = 'war-image-confirm',
	WarImageDraw = 'war-image-draw',
	WarImageLose = 'war-image-lose',
	WarImageWin = 'war-image-win'
}

export enum SelectMenuCustomIds {
	CWLEventConfig = 'cwl-event-config-menu',
	CWLEventRegister = 'cwl-event-register',
	Nickname = 'nickname-menu',
	SuperTroop = 'super-troop-menu'
}

export enum SelectMenuOptionsValue {
	EventEndRolePing = 'event-end-role-ping',
	EventName = 'event-name',
	EventRegistrationChannel = 'event-registration-channel',
	EventStartRolePing = 'event-start-role-ping'
}

export enum ErrorIdentifiers {
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

export enum RedisKeys {
	CWLEventRegistration = 'cwl-event-registration',
	Clan = 'c',
	ClanAlias = 'clan-aliases',
	Links = 'links',
	Player = 'p'
}

export enum EventConfigDefaultValues {
	NotRequired = '_Not Configured_',
	Required = '_Not Configured (Required)_'
}
