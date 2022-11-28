import SketchBook from '../../../app/tools/sketch-book';
import * as shape from "../../../app/tools/shape";
import {QuadTreeEntityCollection, ShapeCircle} from "../../../app/types";
import {createCanvas} from "../../../app/tools/helpers";
import QuadTree from "../../../app/tools/quad-tree";
import VisualQuadTree from "../../../app/tools/debug/visual-quad-tree";

type Walker = {
    circle: ShapeCircle,
    view: HTMLCanvasElement,
}

const MAXIMUM_FREE_WALKERS = 2000;
const RADIUS = 5;
const SIMULATION_SPEED = 100;
const SIZE = 300;
const SPEED = 2;
const HALF_SPEED = SPEED * 0.5;
const TENDENCY = 0.00;
const TWO_PI = 2 * Math.PI;
let displayQuadTree: boolean;
let frame = 0;
let freeWalkers: Walker[] = [];
let quadTree: QuadTree;
let stuckWalkers: Walker[] = [];
let lastDrawCount = 0;
let stuckWalkersBuffer: HTMLCanvasElement;

const views: HTMLCanvasElement[] = ['#D8E1FF', '#69DDFF', '#96CDFF', '#DBBADD', '#BE92A2'].map(function (color: string): HTMLCanvasElement {
    const buffer = createCanvas(2 * RADIUS, 2 * RADIUS);
    const ctx = buffer.getContext('2d');
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    return buffer;
});

const WALKERS_COLORS = views.length - 1;

function drawWalker(ctx: CanvasRenderingContext2D, walker: Walker): void {
    ctx.drawImage(walker.view, walker.circle.center.x - walker.circle.radius, walker.circle.center.y - walker.circle.radius);
}

function update(sketchBook: SketchBook): void {
    let l = freeWalkers.length;
    for (let i = l - 1; i >= 0; i--) {
        const walker = freeWalkers[i];
        const tendencyX = (walker.circle.center.x < sketchBook.SCREEN_HORIZONTAL_CENTER) ? TENDENCY : -TENDENCY;
        const TendencyY = (walker.circle.center.y < sketchBook.SCREEN_VERTICAL_CENTER) ? TENDENCY : -TENDENCY;
        shape.moveCircle(walker.circle, Math.random() * SPEED + tendencyX - HALF_SPEED, Math.random() * SPEED + TendencyY - HALF_SPEED);
        if (
            walker.circle.center.x < -2 * walker.circle.radius
            || walker.circle.center.x > sketchBook.SCREEN_WIDTH + 2 * walker.circle.radius
            || walker.circle.center.y < -2 * walker.circle.radius
            || walker.circle.center.y > sketchBook.SCREEN_HEIGHT + 2 * walker.circle.radius
        ) {
            freeWalkers[i] = freeWalkers[l - 1];
            l--;
            continue;
        }
        let matches: QuadTreeEntityCollection[] = [];
        quadTree.query(
            shape.rectangle(
                shape.point(walker.circle.center.x - (2 * walker.circle.radius), walker.circle.center.y - (2 * walker.circle.radius)),
                4 * walker.circle.radius,
                4 * walker.circle.radius
            ),
            matches
        );
        for (const collection of matches) {
            const d2 = Math.pow(walker.circle.center.x - collection.point.x, 2) + Math.pow(walker.circle.center.y - collection.point.y, 2);
            const r22 = 4 * Math.pow(walker.circle.radius, 2);
            if (r22 >= d2) {
                walker.view = views[0];
                freeWalkers[i] = freeWalkers[l - 1];
                l--;
                stuckWalkers.push(walker);
                quadTree.insert(walker.circle.center);
                break;
            }
        }
    }
    freeWalkers.length = l;
}

function addStuckWalker(sketchBook: SketchBook, x: number, y: number) {
    const walker: Walker = {
        circle: shape.circle(shape.point(x, y), RADIUS), view: views[0]
    };
    quadTree.insert(walker.circle.center);
    stuckWalkers.push(
        walker
    );
}

function drawStuckWalkers(sketchBook: SketchBook): void {
    if (lastDrawCount < stuckWalkers.length) {
        const ctx = stuckWalkersBuffer.getContext('2d');
        ctx.clearRect(0, 0, stuckWalkersBuffer.width, stuckWalkersBuffer.height);
        for (const walker of stuckWalkers) {
            drawWalker(ctx, walker)
        }
    }
    sketchBook.screen.drawImage(stuckWalkersBuffer, 0, 0);
}

export async function setup(sketchBook: SketchBook): Promise<void> {
    quadTree = new QuadTree(shape.rectangle(shape.point(0, 0), sketchBook.SCREEN_WIDTH, sketchBook.SCREEN_HEIGHT), 4);
    stuckWalkersBuffer = createCanvas(sketchBook.SCREEN_WIDTH, sketchBook.SCREEN_HEIGHT);
    displayQuadTree = sketchBook.createCheckbox('Show quad tree', function (checked: boolean): void {
        displayQuadTree = checked;
    }, false);
    addStuckWalker(sketchBook, (sketchBook.SCREEN_HORIZONTAL_CENTER) | 0, (sketchBook.SCREEN_VERTICAL_CENTER) | 0);
}

export function draw(sketchBook: SketchBook): void {
    if (frame % 5 === 0 && freeWalkers.length < MAXIMUM_FREE_WALKERS) {
        const angle = Math.random() * TWO_PI;
        const x = Math.min(sketchBook.SCREEN_WIDTH, Math.max(0, sketchBook.SCREEN_HORIZONTAL_CENTER + (SIZE * Math.cos(angle))));
        const y = Math.min(sketchBook.SCREEN_HEIGHT, Math.max(0, sketchBook.SCREEN_VERTICAL_CENTER + (SIZE * Math.sin(angle))));
        freeWalkers.push({
            circle: shape.circle(shape.point(x, y), RADIUS),
            view: views[1 + ((frame * 0.2) % WALKERS_COLORS)],
        });
    }
    if (sketchBook.mouse.isLeftKeyReleased()) {
        const position = sketchBook.mouse.getPosition();
        addStuckWalker(sketchBook, position.x, position.y);
    }
    for (let i = 0; i < SIMULATION_SPEED; i++) {
        update(sketchBook);
    }
    sketchBook.clearScreen();
    if (displayQuadTree) {
        const visualQuadTree = new VisualQuadTree(quadTree);
        visualQuadTree.draw(sketchBook.screen, 'rgba(255,255,255,0.2)');
    }
    sketchBook.screen.strokeStyle = 'rgba(0,255,0,0.2)';
    sketchBook.screen.beginPath();
    sketchBook.screen.arc(sketchBook.SCREEN_HORIZONTAL_CENTER, sketchBook.SCREEN_VERTICAL_CENTER, SIZE, 0, TWO_PI);
    sketchBook.screen.stroke();

    sketchBook.screen.beginPath();
    for (const walker of freeWalkers) {
        drawWalker(sketchBook.screen, walker)
    }
    drawStuckWalkers(sketchBook);
    frame++;
}