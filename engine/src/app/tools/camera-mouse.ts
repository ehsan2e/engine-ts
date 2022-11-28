import {MouseInterface} from '../interfaces';
import {Vec2D} from './helpers';
import {MouseInfo} from '../types';

export default class CameraMouse implements MouseInterface {
    private readonly mouse: MouseInterface;
    private readonly offset: Vec2D;

    constructor(mouse: MouseInterface, offset: Vec2D) {
        this.mouse = mouse;
        this.offset = offset;
    }

    private applyOffset(position: Vec2D): Vec2D {
        return new Vec2D(position.x + this.offset.x, position.y + this.offset.y);
    }

    getPosition(): Vec2D {
        return this.applyOffset(this.mouse.getPosition());
    }

    isLeftKeyDown(): boolean {
        return this.mouse.isLeftKeyDown()
    }

    isLeftKeyReleased(): boolean {
        return this.mouse.isLeftKeyReleased();
    }

    isRightKeyDown(): boolean {
        return this.mouse.isRightKeyDown();
    }

    isRightKeyReleased(): boolean {
        return this.mouse.isRightKeyReleased();
    }

    read(): MouseInfo {
        const mouseInfo = this.mouse.read()
        return {
            left: mouseInfo.left,
            position: this.applyOffset(mouseInfo.position),
            right: mouseInfo.right,
        };
    }

}