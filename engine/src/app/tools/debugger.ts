import {createCanvas} from './helpers';
import {TimerEvent} from '../types';

export default class Debugger {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private currentSamples: number;
    private frameRate: number;
    private readonly height: number = 200
    private lastTime: number;
    private now: number;
    private samples: number[];
    private readonly SAMPLE_LENGTH: number = 10;
    private readonly width: number = 400;

    constructor() {
        this.canvas = createCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');
        this.reset();
    }

    draw(ctx: CanvasRenderingContext2D, width: number): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'rgba(0,0,0, 0.15)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = 'rgba(255,255,255, 0.25)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(2, 2, this.width - 4, this.height - 4);
        this.ctx.fillStyle = 'rgba(255,255,255, 0.5)';
        this.ctx.font = '15px Helvetica';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        const row: (l: number) => number = (l:number) => l * 25 - 20
        this.ctx.fillText('Debug mode:', 5, row(1));
        this.ctx.fillText(`Time: ${(this.now / 1000).toFixed(1)}`, 5, row(2));
        this.ctx.fillText(`Frame rate [${this.samples.slice().reverse().join(', ')}]: ${this.frameRate?.toFixed(2)}`, 5, row(3));
        ctx.drawImage(this.canvas, width - this.width - 10, 10);
    }

    reset(): void {
        this.currentSamples = 0
        this.frameRate = 0
        this.lastTime = undefined
        this.samples = new Array(this.SAMPLE_LENGTH).fill(0);
    }

    sample(timerEvent: TimerEvent): void {
        if (this.lastTime === undefined) {
            this.lastTime = timerEvent.epochTime;
            this.currentSamples = 1
        } else if (timerEvent.epochTime - this.lastTime > 1000) {
            do {
                this.samples.unshift(this.currentSamples);
                this.lastTime += 1000;
                this.currentSamples = 0;
            } while (timerEvent.epochTime - this.lastTime > 1000);
            if (this.samples.length >= this.SAMPLE_LENGTH) {
                this.samples.length = this.SAMPLE_LENGTH;
            }
            this.frameRate = this.samples.reduce(
                (previousValue: number, currentValue: number) => previousValue + currentValue
                , 0
            ) / this.samples.length;
            this.lastTime = timerEvent.epochTime;
            this.currentSamples = 1
        } else {
            this.currentSamples++
        }
        this.now = timerEvent.time;
    }
}