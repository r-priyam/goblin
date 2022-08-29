import { execSync } from 'node:child_process';
import { exit } from 'node:process';
import { Result } from '@sapphire/framework';
import { cyanBright, greenBright, redBright } from 'colorette';

function executeCommand(operation, action) {
	process.stdout.write(cyanBright(`⏳ Running ${operation} `));

	const result = Result.from(() => {
		action();
		console.log(greenBright('✅ Done'));
	});

	if (result.isErr()) {
		console.log(redBright('❌ Error'));
		console.error(result.unwrapErr().message);
		exit(1);
	}

	return result.unwrap();
}
executeCommand('Git pull', () => execSync('git pull'));
executeCommand('Stop bot service', () => execSync('docker-compose -f .docker/docker-compose.yml stop bot'));
executeCommand('Pull bot latest image', () => execSync('docker-compose -f .docker/docker-compose.yml pull bot'));
executeCommand('Start bot', () => execSync('docker-compose -f .docker/docker-compose.yml up -d bot'));
exit(0);
