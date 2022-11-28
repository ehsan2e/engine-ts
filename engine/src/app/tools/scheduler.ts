type TaskEntry = {
    time: number,
    task: () => void
}

export default class Scheduler {
    private tasks: TaskEntry[] = [];
    private time = 0;

    reset(): void {
        this.tasks = [];
        this.time = 0;
    }

    update(deltaT: number) {
        this.time += deltaT;
        const l = this.tasks.length;
        if (l > 0) {
            let i = 0;
            while (i < l) {
                const taskEntry: TaskEntry = this.tasks[i];
                if (taskEntry.time > this.time) {
                    break;
                }
                taskEntry.task();
                i++;
            }
            if (i > 0) {
                this.tasks.splice(0, i);
            }
        }
    }

    schedule(time: number, task: () => void): void {
        this.tasks.push({time, task});
        this.tasks.sort((a: TaskEntry, b: TaskEntry) => a.time - b.time);
    }
}