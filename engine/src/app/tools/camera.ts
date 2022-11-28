import {Box, Vec2D} from './helpers';
import {MouseInterface} from '../interfaces';
import Mouse from './mouse';
import {Display} from '../types';
import CameraMouse from './camera-mouse';
import RenderUnit from "./render-unit";

type Spotlight = {
    focusBox: Box,
    subject: Box,
};

export default class Camera {
    private readonly captureArea: Box;
    private readonly display: Display;
    public position: Vec2D;
    private readonly mouse: MouseInterface;
    private scene: Box;
    private spotlight: Spotlight;

    constructor(
        display: Display,
        mouse: Mouse,
        scene: Box = new Box(new Vec2D(-Infinity, -Infinity), new Vec2D(Infinity, Infinity))
    ) {
        this.display = display;
        this.position = new Vec2D(scene.position.x, scene.position.y);
        this.mouse = new CameraMouse(mouse, this.position);
        this.scene = scene;
        this.captureArea = new Box(this.position, new Vec2D(display.width, display.height));
    }

    private bringSubjectToFocus() {
        let x = this.position.x;
        let y = this.position.y;
        if ((this.captureArea.left + this.spotlight.focusBox.left) > this.spotlight.subject.left) {
            x -= (this.captureArea.left + this.spotlight.focusBox.left) - this.spotlight.subject.left;
        }
        if ((this.captureArea.top + this.spotlight.focusBox.top) > this.spotlight.subject.top) {
            y -= (this.captureArea.top + this.spotlight.focusBox.top) - this.spotlight.subject.top;
        }
        if (this.spotlight.subject.right > (this.captureArea.left + this.spotlight.focusBox.right)) {
            x += this.spotlight.subject.right - (this.captureArea.left + this.spotlight.focusBox.right);
        }
        if (this.spotlight.subject.bottom > (this.captureArea.top + this.spotlight.focusBox.bottom)) {
            y += this.spotlight.subject.bottom - (this.captureArea.top + this.spotlight.focusBox.bottom);
        }
        if (isNaN(x)) {
            x = this.spotlight.subject.left - this.spotlight.focusBox.left;
        }
        if (isNaN(y)) {
            y = this.spotlight.subject.top - this.spotlight.focusBox.top;
        }
        this.move(x, y);
    }

    clear(): void {
        this.display.ctx.clearRect(0, 0, this.display.width, this.display.height);
        if (this.spotlight !== undefined) {
            this.bringSubjectToFocus();
        }
    }

    capture(renderUnit: RenderUnit): void {
        const box = renderUnit.getBox()
        if (this.captureArea.overlaps(box)) {
            this.display.ctx.drawImage(renderUnit.getBuffer(), box.left - this.position.x, box.top - this.position.y)
        }
    }

    captureOffset(canvas: HTMLCanvasElement, position: Vec2D): void {
        this.capture(new RenderUnit(canvas, new Vec2D(position.x + this.captureArea.left, position.y + this.captureArea.top)));
    }

    getCaptureArea(): Box {
        return this.captureArea;
    }

    follow(focusBox: Box, subject: Box): void {
        this.spotlight = {focusBox, subject};
    }

    move(x: number, y: number): void {
        this.position.set(Math.max(this.scene.left, x), Math.max(this.scene.top, y));
        if (this.captureArea.right > this.scene.right) {
            this.position.x = this.scene.right - this.captureArea.size.x;
        }
        if (this.captureArea.bottom > this.scene.bottom) {
            this.position.y = this.scene.bottom - this.captureArea.size.y;
        }
    }

    setScene(scene: Box): void {
        this.scene = scene;
        this.move(this.position.x, this.position.y);
    }

    unfollow(): void {
        this.spotlight = undefined;
    }

    getMouse(): MouseInterface {
        return this.mouse;
    }
}