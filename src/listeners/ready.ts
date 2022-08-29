import { readFile } from 'node:fs/promises';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, Store } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import figlet from 'figlet';
import gradient from 'gradient-string';

@ApplyOptions<Listener.Options>({
	event: Events.ClientReady,
	once: true
})
export class Ready extends Listener {
	private readonly style = envParseString('NODE_ENV') === 'development' ? yellow : blue;

	public async run() {
		// arguments store aren't needed for slash commands
		const argumentsStore = this.container.stores.get('arguments');
		await argumentsStore.unloadAll();

		await Ready.printBanner();
		this.printStoreDebugInformation();
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) {
			logger.info(this.styleStore(store, false));
		}

		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private static async printBanner() {
		const success = green('+');

		const llc = envParseString('NODE_ENV') === 'development' ? magentaBright : white;
		const blc = envParseString('NODE_ENV') === 'development' ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);
		const { version } = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));

		console.log(
			String.raw`
${gradient.atlas.multiline(figlet.textSync('Goblin'))}
${line01} ${pad}${blc(version)}
${line02} ${pad}[${success}] Gateway
${line03}${
				envParseString('NODE_ENV') === 'development'
					? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}`
					: ''
			}
		`.trim()
		);
	}
}
