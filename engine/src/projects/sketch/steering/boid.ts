import {Vec2D} from '../../../app/tools/helpers';
import * as shape from '../../../app/tools/shape';
import SketchBook from '../../../app/tools/sketch-book';
import {ShapePoint} from '../../../app/types';

const INNER_RADIUS_OFFSET = 15;
const MAX_ACCEL = 0.1;
const MAX_SPEED = 8;
const WING_ANGLE = 5 * Math.PI / 6;

export default class Boid {
    public acceleration: Vec2D = new Vec2D(0, 0);
    private direction: Vec2D = new Vec2D(0, 0);
    public position: Vec2D = new Vec2D(0, 0);
    public readonly radius = 25;
    public velocity: Vec2D = new Vec2D(0, 0);
    private angle: number = 0;
    private tailAngle: number = Math.PI;
    private wing1Angle: number = WING_ANGLE;
    private wing2Angle: number = -WING_ANGLE;

    private head: ShapePoint
    private tail: ShapePoint
    private wing1: ShapePoint
    private wing2: ShapePoint

    constructor() {
        this.updateShape();
    }

    private updateShape(): void {
        this.direction.set(this.velocity.x, this.velocity.y);
        this.angle = Math.atan2(this.direction.y, this.direction.x);
        this.tailAngle = this.angle + Math.PI;
        this.wing1Angle = this.angle + WING_ANGLE;
        this.wing2Angle = this.angle - WING_ANGLE;
        this.head = shape.point(this.position.x + Math.cos(this.angle) * this.radius, this.position.y + Math.sin(this.angle) * this.radius);
        const tailRadius = this.radius - INNER_RADIUS_OFFSET;
        this.tail = shape.point(this.position.x + Math.cos(this.tailAngle) * tailRadius, this.position.y + Math.sin(this.tailAngle) * tailRadius);
        this.wing1 = shape.point(this.position.x + Math.cos(this.wing1Angle) * this.radius, this.position.y + Math.sin(this.wing1Angle) * this.radius);
        this.wing2 = shape.point(this.position.x + Math.cos(this.wing2Angle) * this.radius, this.position.y + Math.sin(this.wing2Angle) * this.radius);
    }

    draw(sketchBook: SketchBook): void {
        sketchBook.screen.strokeStyle = '#FFF';
        sketchBook.screen.beginPath();
        sketchBook.screen.moveTo(this.head.x, this.head.y);
        sketchBook.screen.lineTo(this.wing1.x, this.wing1.y);
        sketchBook.screen.lineTo(this.tail.x, this.tail.y);
        sketchBook.screen.lineTo(this.wing2.x, this.wing2.y);
        sketchBook.screen.lineTo(this.head.x, this.head.y);
        sketchBook.screen.stroke();

        sketchBook.screen.strokeStyle = '#1e751e';
        sketchBook.screen.beginPath();
        sketchBook.screen.moveTo(this.head.x, this.head.y);
        sketchBook.screen.lineTo(this.tail.x, this.tail.y);
        sketchBook.screen.stroke();
    }

    seek(x: number, y: number, arriveRadius: number): Vec2D {
        const point = this.position;
        const force = new Vec2D(x - point.x, y - point.y);
        const arriveRadius2 = Math.pow(arriveRadius, 2);
        const dist2 = Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2);
        force.scale(MAX_SPEED * Math.min(1, dist2 / arriveRadius2));
        force.add(-this.velocity.x, -this.velocity.y);
        force.limit(MAX_ACCEL)
        return force
    }

    update(sketchBook: SketchBook): void {
        this.velocity.addVec2D(this.acceleration);
        if (this.velocity.size2 < 0.005) {
            this.velocity.set(0, 0);
        }
        if (!(this.velocity.x === 0 && this.velocity.y === 0)) {
            this.updateShape();
        }
        this.position.addVec2D(this.velocity);
        this.acceleration.set(0, 0)
    }
}