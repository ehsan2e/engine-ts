import {DynamicInterface, MouseInterface, RenderableInterface} from '../../app/interfaces';
import {transpose, Vec2D} from '../../app/tools/helpers';
import Keyboard from '../../app/tools/keyboard';
import RenderUnit from "../../app/tools/render-unit";

export default class Player implements RenderableInterface, DynamicInterface {
    private readonly acceleration: Vec2D = new Vec2D(0.0003, 0.0003);
    private age = 0;
    private boost: Vec2D = new Vec2D(0, 0);
    private boostX = 0.0003;
    private boostXL = 0;
    private boostXR = 0;
    private dragSamples: Vec2D[] = [];
    private dragging: boolean = false;
    private readonly id: number;
    private position: Vec2D = new Vec2D(200, 50);
    private readonly renderUnit: RenderUnit;
    public readonly size: Vec2D = new Vec2D(64, 96);
    private velocity: Vec2D = new Vec2D(0.3, 0);

    constructor(id: number, background = '#F00', foreground = '#FFF') {
        this.id = id;
        this.renderUnit = RenderUnit.make(
            this.position,
            this.size.x,
            this.size.y,
            (ctx: CanvasRenderingContext2D) => {
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, this.size.x, this.size.y);
                ctx.fillStyle = foreground;
                ctx.font = '20px Helvetica';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${this.id}`, this.size.x / 2, this.size.y / 2 - 25);
                ctx.fillText((this.age / 1000).toFixed(1).toString(), this.size.x / 2, this.size.y / 2 + 10);
                ctx.font = '12px Helvetica';
                ctx.fillText(`(${this.position.x | 0},${this.position.y | 0})`, this.size.x / 2, this.size.y / 2 + 30);
            }
        );
    }

    boostLeft(on: boolean): void {
        if (on) {
            this.boostXL = this.boostX;
        } else {
            this.boostXL = 0;
        }
        this.boost.x = this.boostXR - this.boostXL;
    }

    boostRight(on: boolean): void {
        if (on) {
            this.boostXR = this.boostX
        } else {
            this.boostXR = 0;
        }
    }

    boostUp(on: boolean): void {
        if (on) {
            this.boost.y = -0.0005;
        } else {
            this.boost.y = 0;
        }
    }

    getAcceleration(): Vec2D {
        return this.acceleration;
    }

    getBoost(): Vec2D {
        return this.boost;
    }

    getPosition(): Vec2D {
        return this.position;
    }

    getVelocity(): Vec2D {
        return this.velocity;
    }

    navigate(keyboard: Keyboard, mouse: MouseInterface): void {
        if (keyboard.isPressed('ArrowUp')) {
            this.boostUp(true);
        } else if (keyboard.isReleased('ArrowUp')) {
            this.boostUp(false);
        }
        if (keyboard.isPressed('ArrowLeft')) {
            this.boostLeft(true);
        } else if (keyboard.isReleased('ArrowLeft')) {
            this.boostLeft(false);
        }
        if (keyboard.isPressed('ArrowRight')) {
            this.boostRight(true);
        } else if (keyboard.isReleased('ArrowRight')) {
            this.boostRight(false);
        }
        if (mouse.isLeftKeyDown()) {
            const pos: Vec2D = mouse.getPosition();
            this.position.set(pos.x, pos.y);
            this.dragging = true;
        } else if (mouse.isLeftKeyReleased()) {
            this.dragging = false;
            const pos: Vec2D = mouse.getPosition();
            this.position.set(pos.x, pos.y);
        }
    }

    getRenderUnit(): RenderUnit {
        return this.renderUnit;
    }

    update(deltaT: number): void {
        this.age += deltaT;
        if (this.dragging) {
            this.dragSamples.unshift(new Vec2D(this.position.x, this.position.y));
            this.dragSamples.length = 3;
            this.velocity.set(0, 0);
        } else {
            const l = this.dragSamples.length;
            if (l > 1) {
                this.velocity.set(
                    transpose(this.dragSamples[0].x - this.dragSamples[l - 1].x, -105, 105, -45, 45) / (deltaT * (l - 1)),
                    transpose(this.dragSamples[0].y - this.dragSamples[l - 1].y, -105, 105, -45, 45) / (deltaT * (l - 1))
                );
                this.dragSamples.length = 0;
            } else if (l === 1) {
                this.dragSamples.length = 0;
            } else {
                this.boost.x = this.boostXR - this.boostXL;
                this.velocity.add(
                    (this.acceleration.x + this.boost.x) * deltaT,
                    (this.acceleration.y + this.boost.y) * deltaT
                );
            }
            this.position.add(this.velocity.x * deltaT, this.velocity.y * deltaT);
            if (this.position.x < 5) {
                this.position.x = 5
                this.boost.x = 0;
                this.velocity.x = 0.3;
            }
            if (this.position.y < 5) {
                this.position.y = 5
                this.boost.y = 0;
                this.velocity.y = 0;
            }
        }
    }

    static make(serial: number): Player {
        return serial % 2 === 0
            ? new Player(serial, '#0F0', '#050')
            : new Player(serial, '#F00', '#500');
    }
}