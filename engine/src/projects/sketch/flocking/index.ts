import * as collider from '../../../app/tools/collider';
import {createCanvas, Vec2D} from '../../../app/tools/helpers';
import QuadTree from '../../../app/tools/quad-tree';
import SketchBook from '../../../app/tools/sketch-book';
import * as shape from '../../../app/tools/shape';
import {QuadTreeEntityCollection, ShapeCircle, ShapeRectangle} from '../../../app/types';
import VisualQuadTree from "../../../app/tools/debug/visual-quad-tree";

type Boid = {
    acceleration: Vec2D,
    shape: ShapeCircle,
    velocity: Vec2D,
    state: number,
}

const BOIDS_COUNT = 1000;
const CAPACITY = 4;
const MAX_SPEED = 5;
const RADIUS = 5;
const DIAMETER = 2 * RADIUS;
let mouseReleased: boolean;
let boids: Boid[];
let rectangle: ShapeRectangle = shape.rectangle(shape.point(0, 0), 300, 150);
let velocity: Vec2D;
let animate: boolean;
const nodes: HTMLCanvasElement[] = ['#00F', '#F00', '#FF0', '#0FF'].map(function (color: string): HTMLCanvasElement {
    const buffer = createCanvas(10, 10);
    const ctx = buffer.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    return buffer;
});

function createBoid(x: number, y: number): Boid {
    return {
        acceleration: new Vec2D(0, 0),
        shape: shape.circle(shape.point(x, y), RADIUS),
        velocity: Vec2D.fromAngle(Math.random() * 2 * Math.PI, Math.random() * 5),
        state: 0,
    };
}

export async function setup(sketchBook: SketchBook): Promise<void> {
    velocity = new Vec2D(RADIUS, RADIUS);
    mouseReleased = true;
    boids = [];
    animate = sketchBook.createCheckbox('animate', function (checked: boolean) {
        animate = checked;
    });

    for (let i = 0; i < BOIDS_COUNT; i++) {
        boids.push(createBoid(RADIUS + Math.random() * (sketchBook.SCREEN_WIDTH - DIAMETER), RADIUS + Math.random() * (sketchBook.SCREEN_HEIGHT - (DIAMETER))));
    }
}

export function draw(sketchBook: SketchBook): void {
    const quadTree = new QuadTree(shape.rectangle(shape.point(0, 0), sketchBook.SCREEN_WIDTH, sketchBook.SCREEN_HEIGHT), CAPACITY);
    let list: { [key: string]: Boid } = {};
    for (const boid of boids) {
        boid.state = 0;
        if (animate) {
            boid.velocity.addVec2D(boid.acceleration);
            boid.velocity.limit(MAX_SPEED);
            shape.moveCircle(boid.shape, boid.velocity.x, boid.velocity.y);
            boid.acceleration.set(0, 0);
            let hitEdge = false;
            if (boid.shape.center.x - boid.shape.radius < 0) {
                shape.moveCircle(boid.shape, -(boid.shape.center.x - boid.shape.radius), 0);
                boid.velocity.x = Math.abs(boid.velocity.x);
                hitEdge = true;
            } else {
                const diffRight = boid.shape.center.x + boid.shape.radius - sketchBook.SCREEN_WIDTH;
                if (diffRight > 0) {
                    shape.moveCircle(boid.shape, -diffRight, 0);
                    boid.velocity.x = -Math.abs(boid.velocity.x);
                    hitEdge = true;
                }

            }
            if (boid.shape.center.y - boid.shape.radius < 0) {
                shape.moveCircle(boid.shape, 0, -(boid.shape.center.y - boid.shape.radius));
                boid.velocity.y = Math.abs(boid.velocity.y);
                hitEdge = true;
            } else {
                const diffBottom = boid.shape.center.y + boid.shape.radius - sketchBook.SCREEN_HEIGHT;
                if (diffBottom > 0) {
                    shape.moveCircle(boid.shape, 0, -diffBottom);
                    boid.velocity.y = -Math.abs(boid.velocity.y);
                    hitEdge = true;
                }
            }
            if (hitEdge) {
                boid.velocity.mult(0.9);
            }
        }
        const entity = quadTree.insert(boid.shape.center);
        if (entity) {
            list['' + entity.id] = boid;
        }
    }
    const matches: QuadTreeEntityCollection[] = [];
    quadTree.query(rectangle, matches);
    for (const collection of matches) {
        for (const match of collection.entities) {
            if (list[match.id + '']) {
                list[match.id + ''].state = 1;
                const force = list[match.id + ''].velocity.copy();
                force.scale(0.008);
                list[match.id + ''].acceleration.addVec2D(force);
            }
        }
    }
    for (const id of Object.keys(list)) {
        const matches: QuadTreeEntityCollection[] = [];
        quadTree.query(shape.rectangle(shape.point(list[id].shape.center.x - RADIUS, list[id].shape.center.y - RADIUS), 2 * DIAMETER, 2 * DIAMETER), matches);
        for(const collection of matches) {
            for (const match of collection.entities) {
                if (match.id + '' !== id && list[match.id + ''] && collider.circleAndPointColliding(list[id].shape, match.point)) {
                    const accel = list[id].velocity.copy();
                    list[match.id].acceleration.addVec2D(accel);
                    accel.mult(-1)
                    list[id].acceleration.addVec2D(accel);
                    if (list[id].state < 2) {
                        list[id].state += 2;
                    }
                }
            }
        }
    }
    if (mouseReleased) {
        if (sketchBook.mouse.isLeftKeyDown()) {
            mouseReleased = false;
            const mousePosition = sketchBook.mouse.getPosition();
            const boid: Boid = createBoid(mousePosition.x, mousePosition.y);
            boids.push(boid);
            quadTree.insert(boid.shape.center);
        }
    } else {
        if (sketchBook.mouse.isLeftKeyReleased()) {
            mouseReleased = true;
        }
    }
    if (sketchBook.mouse.isRightKeyReleased()) {
        console.log(quadTree);
    }

    if (animate) {
        shape.movePolygon(rectangle, velocity.x, velocity.y);
    } else {
        const mousePosition = sketchBook.mouse.getPosition();
        shape.movePolygon(rectangle, mousePosition.x - rectangle.position.x - (rectangle.width / 2), mousePosition.y - rectangle.position.y - (rectangle.height / 2));
    }

    if (rectangle.position.x < 0) {
        shape.movePolygon(rectangle, -rectangle.position.x, 0);
        velocity.x = Math.abs(velocity.x);
    } else {
        const diffRight = rectangle.position.x + rectangle.width - sketchBook.SCREEN_WIDTH;
        if (diffRight > 0) {
            shape.movePolygon(rectangle, -diffRight, 0);
            velocity.x = -Math.abs(velocity.x);
        }
    }
    if (rectangle.position.y < 0) {
        shape.movePolygon(rectangle, 0, -rectangle.position.y);
        velocity.y = Math.abs(velocity.y);
    } else {
        const diffBottom = rectangle.position.y + rectangle.height - sketchBook.SCREEN_HEIGHT;
        if (diffBottom > 0) {
            shape.movePolygon(rectangle, 0, -diffBottom);
            velocity.y = -Math.abs(velocity.y);
        }
    }

    sketchBook.clearScreen();
    const visualQuadTree = new VisualQuadTree(quadTree);
    visualQuadTree.draw(sketchBook.screen, 'rgba(255,255,255,0.2)');
    for (const boid of boids) {
        sketchBook.screen.drawImage(nodes[boid.state], boid.shape.center.x - 5, boid.shape.center.y - 5);
    }
    sketchBook.screen.strokeStyle = '#0FF';
    sketchBook.screen.beginPath();
    sketchBook.screen.rect(rectangle.position.x + 5, rectangle.position.y + 5, rectangle.width - 10, rectangle.height - 10);
    sketchBook.screen.stroke();
}