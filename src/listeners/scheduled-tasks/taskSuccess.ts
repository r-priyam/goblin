import { ApplyOptions } from '@sapphire/decorators';
import { Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/framework';
import { ScheduledTaskEvents, type ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<Listener.Options>({
	name: 'ScheduledTaskSuccess',
	event: ScheduledTaskEvents.ScheduledTaskSuccess
})
export class BotListener extends Listener<typeof ScheduledTaskEvents.ScheduledTaskSuccess> {
	public override run(task: ScheduledTask, _payload: unknown, _taskRunResult: unknown, duration: number) {
		this.container.logger.debug(
			`[Scheduled-Task]: successfully ran task: ${task.name} in ${this.formatDuration(duration)}`
		);
	}

	public override onLoad() {
		this.enabled = (this.logger as Logger).level <= LogLevel.Debug;
		return super.onLoad();
	}

	private formatDuration(duration: number) {
		if (duration >= 1_000) {
			return `${(duration / 1_000).toFixed(2)}s`;
		}

		if (duration >= 1) {
			return `${duration.toFixed(2)}ms`;
		}

		return `${(duration * 1_000).toFixed(2)}μs`;
	}
}
