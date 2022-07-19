import { EmbedBuilder } from 'discord.js';

import { Colors } from '#utils/constants';

class Embed {
	public info(description: string) {
		return new EmbedBuilder({ title: 'Info', description, color: Colors.Blue });
	}

	public success(description: string) {
		return new EmbedBuilder({ title: 'Success', description, color: Colors.Green });
	}

	public warning(description: string) {
		return new EmbedBuilder({ title: 'Warning', description, color: Colors.Yellow });
	}

	public error(description: string) {
		return new EmbedBuilder({ title: 'Error', description, color: Colors.Red });
	}
}

export const embedBuilder = new Embed();
