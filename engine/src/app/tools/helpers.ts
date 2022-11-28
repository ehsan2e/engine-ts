import Debugger from './debugger';
import EventEmitter from './event-emitter';
import Timer from './timer';
import {
    Display,
    Game,
    GameContext,
    GameState,
    GameStateMachineConfig,
    GameStateMachineTransition,
    Sketch, SketchStatePayload,
} from '../types';
import Mouse from './mouse';
import Keyboard from './keyboard';
import Sketching from "../game-states/sketching";
import {GAME_STATE_UNDEFINED} from "../constants";

export function createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export function createGameContext(
    container: HTMLDivElement,
    display: Display,
    mouse: Mouse,
    frameRate: number,
    debug = false,
    maxTimerIntervals: number
): GameContext {
    const keyboard = new Keyboard();
    keyboard.attach();
    return {
        container,
        debug,
        debugger: new Debugger(),
        display,
        keyboard,
        mouse,
        timer: new Timer({eventEmitter: new EventEmitter(), frameRate, maxIntervals: maxTimerIntervals}),
    }
}

export function createGameFromSketch(sketch: Sketch): Game {
    const initialState = 'SKETCH';
    const initialStatePayload: SketchStatePayload = {sketch};
    const states: { [key: string]: GameState<object>; } = {};
    states[initialState] = new Sketching();
    const transitions: GameStateMachineTransition[] = [
        {from: GAME_STATE_UNDEFINED, to: initialState}
    ]
    const stateMachineConfig: GameStateMachineConfig = {states, transitions}
    return {initialState, initialStatePayload, stateMachineConfig}
}

export function transpose(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
    value = Math.max(fromMin, Math.min(value, fromMax));
    return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin)
}

export function lerp (a: number, b: number, t:number): number {
    return a + (b-a) * t;
}

export function lerpBox (a: Box, b: Box, t:number): Box {
    return new Box(lerpVec2d(a.position, b.position, t), lerpVec2d(a.size, b.size, t));
}

export function lerpVec2d (a: Vec2D, b: Vec2D, t:number): Vec2D {
    return new Vec2D(lerp(a.x, b.x, t), lerp(a.y, b.y, t))
}

export class Vec2D {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.set(x, y);
    }

    get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    get size(): number {
        return Math.hypot(this.x, this.y);
    }

    get size2(): number {
        return (this.x * this.x) + (this.y * this.y);
    }

    add(offsetX: number, offsetY: number): void {
        this.set(this.x + offsetX, this.y + offsetY);
    }

    addVec2D(vec2d: Vec2D): void {
        this.add(vec2d.x, vec2d.y);
    }

    copy(): Vec2D {
        return new Vec2D(this.x, this.y);
    }

    limit(value: number) {
        if(this.size2 > value * value){
            this.scale(value);
        }
    }

    mult(number: number): void {
        this.x *= number;
        this.y *= number;
    }

    scale(magnitude: number): void {
        const a = this.angle;
        this.x = magnitude * Math.cos(a);
        this.y = magnitude * Math.sin(a);

    }

    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    static fromAngle(angle: number, size: number = 1): Vec2D {
        return new Vec2D(size * Math.cos(angle), size * Math.sin(angle));
    }
}

export class Box {
    public readonly position: Vec2D;
    public readonly size: Vec2D;

    constructor(position: Vec2D, size: Vec2D) {
        this.position = position;
        this.size = size;
    }

    get bottom(): number {
        return this.position.y + this.size.y;
    }

    set bottom(value: number) {
        this.position.y= value - this.height;
    }

    get height(): number {
        return this.size.y
    }

    set height(value: number) {
        this.size.y = value;
    }

    get left(): number {
        return this.position.x;
    }

    set left(value: number) {
        this.position.x = value;
    }

    get right(): number {
        return this.position.x + this.size.x;
    }

    set right(value: number) {
        this.position.x = value - this.size.x;
    }

    get top(): number {
        return this.position.y;
    }

    set top(value: number) {
        this.position.y = value;
    }

    get width(): number {
        return this.size.x
    }

    set width(value: number) {
        this.size.x = value
    }

    contains(point: Vec2D): boolean {
        return this.left <= point.x && this.right >= point.x && this.top <= point.y && this.bottom >= point.y;
    }

    includes(position: Vec2D, width: number, height: number): boolean {
        return (this.right >= position.x)
            && (this.left <= position.x + width)
            && (this.bottom >= position.y)
            && (this.top <= position.y + height);
    }

    overlaps(that: Box): boolean {
        return this.includes(that.position, that.width, that.height);
    }

    static make(x: number, y: number, width: number, heght: number): Box {
        return new Box(new Vec2D(x, y), new Vec2D(width, heght))
    }

    static makeFromPosition(position: Vec2D, width: number, heght: number): Box {
        return new Box(position, new Vec2D(width, heght))
    }
}