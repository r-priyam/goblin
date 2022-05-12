import 'reflect-metadata';
import '@sapphire/plugin-logger/register';

import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';
import type { Logger } from '@sapphire/framework';
import { ApplicationCommandRegistries, container, Piece, RegisterBehavior } from '@sapphire/framework';
import { createColors } from 'colorette';
import dotenv from 'dotenv';
import type { GoblinClient } from './extensions/GoblinClient';
import { srcFolder } from '#utils/constants';

dotenv.config({ path: fileURLToPath(new URL('.env', srcFolder)) });

inspect.defaultOptions.depth = 1;
createColors({ useColor: true });

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

Object.defineProperties(Piece.prototype, {
	client: { get: () => container.client },
	logger: { get: () => container.logger }
});

declare module '@sapphire/pieces' {
	interface Piece {
		client: GoblinClient;
		logger: Logger;
	}
}
