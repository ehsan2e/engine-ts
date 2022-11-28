import {Box, createCanvas, Vec2D} from "./helpers";

export default class RenderUnit {
    private position: Vec2D;
    private box: Box;
    private readonly buffer: HTMLCanvasElement;
    private readonly draw: (ctx: CanvasRenderingContext2D) => void;

    constructor(buffer: HTMLCanvasElement, position: Vec2D, draw?: (ctx: CanvasRenderingContext2D) => void) {
        this.buffer = buffer;
        this.setPosition(position);
        this.draw = draw;
    }

    getBox(): Box {
        return this.box
    }

    setPosition(position: Vec2D) {
        this.position = position
        this.box = Box.makeFromPosition(this.position, this.buffer.width, this.buffer.height);
    }

    getBuffer(): HTMLCanvasElement {
        if (this.draw !== undefined) {
            this.draw(this.buffer.getContext('2d'));
        }
        return this.buffer;
    }

    static make(position: Vec2D, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): RenderUnit {
        return new RenderUnit(createCanvas(width, height), position, draw);
    }
}