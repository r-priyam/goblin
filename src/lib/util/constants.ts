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
	Typing = '<a:typing:597589448607399949>',
	Success = '<:success:959344194785271809>',
	Error = '<:error:959359264533643274>'
}

export const enum ModalCustomIds {
	StartClanEmbed = 'start-clan-embed-modal'
}

export const enum ModalInputCustomIds {
	StartClanEmbedLeaderInput = 'start-clan-embed-leader-input',
	StartClanEmbedColorInput = 'start-clan-embed-color-input'
}

export const enum ButtonCustomIds {
	AddClanRequirement = 'add-clan-requirement-button'
}
