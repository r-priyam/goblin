import 'reflect-metadata';
import '@sapphire/plugin-logger/register';

import { fileURLToPath } from 'node:url';
import { inspect } from 'node:util';
import { ApplicationCommandRegistries, Logger, container, Piece, RegisterBehavior } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { Client } from 'clashofclans.js';
import { createColors } from 'colorette';
import dotenv from 'dotenv';
import type { GoblinClient } from './extensions/GoblinClient';
import { srcFolder } from '#utils/constants';

dotenv.config({ path: fileURLToPath(new URL('.env', srcFolder)) });

inspect.defaultOptions.depth = 1;
createColors({ useColor: true });

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

container.coc = new Client({ restRequestTimeout: Time.Second * 30 });

Object.defineProperties(Piece.prototype, {
	client: { get: () => container.client },
	logger: { get: () => container.logger }
});

declare module '@sapphire/pieces' {
	interface Container {
		coc: Client;
	}
	interface Piece {
		client: GoblinClient;
		logger: Logger;
		coc: Client;
	}
}
