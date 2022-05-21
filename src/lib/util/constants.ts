/* eslint-disable unicorn/number-literal-case */
import { URL } from 'node:url';

export const rootFolder = new URL('../../../', import.meta.url);
export const srcFolder = new URL('src/', rootFolder);

export const enum Colors {
	White = 0xe7_e7_e8,
	Amber = 0xff_c1_07,
	Amber300 = 0xff_d5_4f,
	Blue = 0x21_96_f3,
	BlueGrey = 0x60_7d_8b,
	Brown = 0x79_55_48,
	Cyan = 0x00_bc_d4,
	DeepOrange = 0xff_57_22,
	DeepPurple = 0x67_3a_b7,
	Green = 0x4c_af_50,
	Grey = 0x9e_9e_9e,
	Indigo = 0x3f_51_b5,
	LightBlue = 0x03_a9_f4,
	LightGreen = 0x8b_c3_4a,
	Lime = 0xcd_dc_39,
	Lime300 = 0xdc_e7_75,
	Orange = 0xff_98_00,
	Pink = 0xe9_1e_63,
	Purple = 0x9c_27_b0,
	Red = 0xf4_43_36,
	Red300 = 0xe5_73_73,
	Teal = 0x00_96_88,
	Yellow = 0xff_eb_3b,
	Yellow300 = 0xff_f1_76
}

export const enum Emotes {
	Typing = '<a:typing:597589448607399949>',
	Success = '<:success:959344194785271809>',
	Error = '<:error:959359264533643274>'
}
