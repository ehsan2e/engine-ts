import {EVENT_TIMER_TICK} from '../constants';
import {TimerConfig, TimerEvent} from '../types';

export type TimerListener = (event: TimerEvent) => void;

export default class Timer {
    private animationId: number | undefined = undefined;
    private readonly config: TimerConfig;
    private readonly intervalDuration: number;
    private lag = 0;
    private offset = 0;
    private time: number = undefined;
    private running = false;
    private stoppedAt: number;

    constructor(config: TimerConfig) {
        this.config = config
        this.intervalDuration = 1000 / config.frameRate;
    }

    private enqueue(): void {
        if (this.isRunning()) {
            this.animationId = requestAnimationFrame(this.run.bind(this));
        }
    }

    private run(time: DOMHighResTimeStamp): void {
        if (this.time === undefined) {
            this.time = 0
            this.offset = time;
        }
        if (this.stoppedAt !== undefined) {
            this.offset = time - this.stoppedAt;
            this.stoppedAt = undefined;
        }
        let intervals = ((time - (this.offset + this.time)) / this.intervalDuration) | 0
        if(intervals < 0){
            throw new Error('!...');
        }
        if(intervals > this.config.maxIntervals){
            this.offset += (intervals - 1) * this.intervalDuration;
            intervals = 1;
        }
        this.time += intervals * this.intervalDuration;
        this.lag = time - this.time;
        if (intervals > 0) {
            const timerEvent: TimerEvent = {
                duration: this.intervalDuration,
                epochTime: Date.now(),
                intervals,
                lag: this.lag,
                time: this.time,
            };
            this.config.eventEmitter?.emit(EVENT_TIMER_TICK, timerEvent);
        }
        this.enqueue();
    }

    attach(listener: TimerListener): void {
        this.config.eventEmitter.on(EVENT_TIMER_TICK, listener);
    }

    continue() {
        this.running = true;
        this.enqueue();
    }

    detachAll() {
        this.config.eventEmitter.off(EVENT_TIMER_TICK);
    }

    isRunning(): boolean {
        return this.running;
    }

    start(): void {
        this.reset();
        this.running = true;
        this.enqueue();
    }

    stop(): void {
        if (this.isRunning()) {
            this.running = false
            this.stoppedAt = this.time;
            if (this.animationId !== undefined) {
                cancelAnimationFrame(this.animationId);
                this.animationId = undefined;
            }
        }
    }

    reset() {
        this.lag = 0;
        this.offset = 0;
        this.running = false;
        this.stoppedAt = undefined;
        this.time = undefined;
    }
}