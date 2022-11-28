import {Vec2D} from './helpers';
import {MouseInfo, MouseKeyState} from '../types';
import {MouseInterface} from "../interfaces";

export default class Mouse implements MouseInterface{
    private leftKey: MouseKeyState = MouseKeyState.NEUTRAL;
    private rightKey: MouseKeyState = MouseKeyState.NEUTRAL;
    private position: Vec2D = new Vec2D(0, 0);

    attach(canvas: HTMLCanvasElement): void {
        canvas.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.button === 0) {
                this.leftKey = MouseKeyState.PRESSED;
            } else if (event.button === 2) {
                this.rightKey = MouseKeyState.PRESSED;
            }
            this.position.set(
                Math.max(0, Math.min(event.offsetX, canvas.width)),
                Math.max(0, Math.min(event.offsetY, canvas.height))
            );
        });
        canvas.addEventListener('mouseup', (event: MouseEvent) => {
            if (event.button === 0) {
                this.leftKey = MouseKeyState.RELEASED;
            }else if (event.button === 2) {
                this.rightKey = MouseKeyState.RELEASED;
            }
            this.position.set(
                Math.max(0, Math.min(event.offsetX, canvas.width)),
                Math.max(0, Math.min(event.offsetY, canvas.height))
            );
        });
        window.addEventListener('mouseup', (event: MouseEvent) => {
            if (event.button === 0) {
                if(this.leftKey === MouseKeyState.PRESSED){
                    this.leftKey = MouseKeyState.RELEASED;
                }
            }else if (event.button === 2) {
                if(this.rightKey === MouseKeyState.PRESSED) {
                    this.rightKey = MouseKeyState.RELEASED;
                }
            }
        });

        canvas.addEventListener('mousemove', (event: MouseEvent) => {
            this.position.set(
                Math.max(0, Math.min(event.offsetX, canvas.width)),
                Math.max(0, Math.min(event.offsetY, canvas.height))
            );
        });

        canvas.addEventListener('contextmenu', (event: PointerEvent) => {
            event.preventDefault();
            return false;
        })
    }

    flush(): void {
        if (this.leftKey === MouseKeyState.RELEASED) {
            this.leftKey = MouseKeyState.NEUTRAL;
        }
        if (this.rightKey === MouseKeyState.RELEASED) {
            this.rightKey = MouseKeyState.NEUTRAL;
        }
    }

    getPosition(): Vec2D {
        return this.position
    }

    isLeftKeyDown(): boolean {
        return this.leftKey === MouseKeyState.PRESSED;
    }

    isLeftKeyReleased(): boolean {
        return this.leftKey === MouseKeyState.RELEASED;
    }

    isRightKeyDown(): boolean {
        return this.rightKey === MouseKeyState.PRESSED;
    }

    isRightKeyReleased(): boolean {
        return this.rightKey === MouseKeyState.RELEASED;
    }

    read(): MouseInfo {
        return {
            left: this.leftKey,
            position: this.position,
            right: this.rightKey,
        }
    }
}