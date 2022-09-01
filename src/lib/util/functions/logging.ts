import { blueBright, greenBright, whiteBright, yellowBright } from 'colorette';

export function logInfo(prefix: string, message: string) {
	return `${blueBright(`[${prefix}]`)} ${whiteBright(message)}`;
}

export function logWarning(prefix: string, message: string) {
	return `${yellowBright(`[${prefix}]`)} ${whiteBright(message)}`;
}

export function logSuccess(prefix: string, message: string) {
	return `${greenBright(`[${prefix}]`)} ${whiteBright(message)}`;
}
