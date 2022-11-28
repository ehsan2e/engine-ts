import * as collider from '../../../app/tools/collider';
import SketchBook from '../../../app/tools/sketch-book';
import {
    CollisionObject,
    Shape,
    ShapeCircle,
    ShapeLine,
    ShapePoint,
    ShapePolygon,
    ShapeType
} from "../../../app/types";

const X = 5;
const X_SQRT_2 = Math.sqrt(2) * X;
const TWO_PI = 2 * Math.PI;
const shapes: [string, CollisionObject<Shape>][] = []
let collisionResult: { [key: string]: boolean } = {};
let activeName: string = undefined
let activeShape: CollisionObject<Shape> = undefined;


function checkCollision(name: string) {
    activeName = name;
    collisionResult = {};
    const item = shapes.find((item) => item[0] === name);
    activeShape = item === undefined ? undefined : item[1];
    for (const [c1, s2] of shapes) {
        collisionResult[c1] = (activeShape && c1 !== name) ? collider.isColliding(activeShape, s2) : false;
    }
}


export async function setup(sketchBook: SketchBook): Promise<void> {
    shapes.push(['PNT1', collider.point(50, 150)]);
    shapes.push(['PNT2', collider.point(150, 150)]);
    shapes.push(['LIN1', collider.line(<ShapePoint>{x: 10, y: 10}, <ShapePoint>{x: 300, y: 300})]);
    shapes.push(['LIN2', collider.line(<ShapePoint>{x: 10, y: 200}, <ShapePoint>{x: 300, y: 200})]);
    shapes.push(['LIN3', collider.line(<ShapePoint>{x: 10, y: 210}, <ShapePoint>{x: 300, y: 510})]);
    shapes.push(['LIN4', collider.line(<ShapePoint>{x: 10 + 29 * 5, y: 210 + 30 * 5}, <ShapePoint>{
        x: 10 + 29 * 15,
        y: 210 + 30 * 15
    })]);
    shapes.push(['REC1', collider.rectangle(<ShapePoint>{x: 10, y: 110},110, 150)])
    shapes.push(['LIN5', collider.line(<ShapePoint>{
        x: sketchBook.SCREEN_WIDTH - 10,
        y: sketchBook.SCREEN_HEIGHT - 200
    }, <ShapePoint>{x: sketchBook.SCREEN_WIDTH - 400, y: sketchBook.SCREEN_HEIGHT - 10})]);
    shapes.push(['CIR1', collider.circle(<ShapePoint>{x: 500, y: 350}, 50)]);

    activeName = sketchBook.createSelect(shapes.map(([name]) => [name]), (value: string) => {
        activeName = value;
    }, false);
}

function drawShape(sketchBook: SketchBook, name: string, shape: CollisionObject<Shape>) {
    if (activeName === name) {
        sketchBook.screen.fillStyle = 'rgba(0,0,255, 0.2)';
        sketchBook.screen.strokeStyle = 'rgba(0,0,255, 0.8)';
    } else if (collisionResult[name]) {
        sketchBook.screen.fillStyle = 'rgba(255,0,0, 0.2)';
        sketchBook.screen.strokeStyle = '#F00';
    } else {
        sketchBook.screen.fillStyle = 'rgba(0,255,0, 0.2)';
        sketchBook.screen.strokeStyle = '#0F0';
    }
    switch (shape.type) {
        case ShapeType.CIRCLE:
            sketchBook.screen.beginPath();
            sketchBook.screen.arc((shape.shape as ShapeCircle).center.x, (shape.shape as ShapeCircle).center.y, (shape.shape as ShapeCircle).radius, 0, TWO_PI);
            sketchBook.screen.stroke();
            sketchBook.screen.fill();
            break;
        case ShapeType.POINT:
            sketchBook.screen.beginPath();
            sketchBook.screen.moveTo((shape.shape as ShapePoint).x - X_SQRT_2, (shape.shape as ShapePoint).y);
            sketchBook.screen.lineTo((shape.shape as ShapePoint).x + X_SQRT_2, (shape.shape as ShapePoint).y);
            sketchBook.screen.moveTo((shape.shape as ShapePoint).x - X, (shape.shape as ShapePoint).y - X);
            sketchBook.screen.lineTo((shape.shape as ShapePoint).x + X, (shape.shape as ShapePoint).y + X);
            sketchBook.screen.moveTo((shape.shape as ShapePoint).x - X, (shape.shape as ShapePoint).y + X);
            sketchBook.screen.lineTo((shape.shape as ShapePoint).x + X, (shape.shape as ShapePoint).y - X);
            sketchBook.screen.moveTo((shape.shape as ShapePoint).x, (shape.shape as ShapePoint).y - X_SQRT_2);
            sketchBook.screen.lineTo((shape.shape as ShapePoint).x, (shape.shape as ShapePoint).y + X_SQRT_2);
            sketchBook.screen.stroke();
            break;
        case ShapeType.LINE:
            sketchBook.screen.beginPath();
            sketchBook.screen.moveTo((shape.shape as ShapeLine).start.x, (shape.shape as ShapeLine).start.y);
            sketchBook.screen.lineTo((shape.shape as ShapeLine).end.x, (shape.shape as ShapeLine).end.y);
            sketchBook.screen.stroke();
            break
        default:
            sketchBook.screen.beginPath();
            const polygon = shape.shape as ShapePolygon;
            sketchBook.screen.moveTo(polygon.points[0].x, polygon.points[0].y);
            for (let i = polygon.points.length - 1; i >= 0; i--) {
                sketchBook.screen.lineTo(polygon.points[i].x, polygon.points[i].y);
            }
            sketchBook.screen.closePath();
            sketchBook.screen.fill();
            sketchBook.screen.stroke();
    }
}

function drawLabel(sketchBook: SketchBook, name: string, collisionObject: CollisionObject<Shape>) {
    sketchBook.screen.textBaseline = 'middle';
    sketchBook.screen.font = '14px Helvetica';
    sketchBook.screen.fillStyle = '#FFF';
    sketchBook.screen.strokeStyle = '#FFF';
    let x = 0;
    let y = 0;
    let n = 0;
    switch (collisionObject.type) {
        case ShapeType.CIRCLE:
            x = (collisionObject.shape as ShapeCircle).center.x;
            y = (collisionObject.shape as ShapeCircle).center.y;
            n = 1;
            break;
        case ShapeType.LINE:
            x = (collisionObject.shape as ShapeLine).start.x + (collisionObject.shape as ShapeLine).end.x;
            y = (collisionObject.shape as ShapeLine).start.y + (collisionObject.shape as ShapeLine).end.y;
            n = 2;
            break;
        case ShapeType.POINT:
            x = (collisionObject.shape as ShapePoint).x;
            y = (collisionObject.shape as ShapePoint).y;
            n = 1;
            break;
        default:
            for (const point of (collisionObject.shape as ShapePolygon).points) {
                x += point.x;
                y += point.y;
                n++;
            }
    }
    x = (x / n) | 0;
    y = (y / n) | 0;
    const xDir = x < (sketchBook.SCREEN_WIDTH / 2) ? 1 : -1;
    const yDir = y < (sketchBook.SCREEN_HEIGHT / 2) ? 1 : -1;
    sketchBook.screen.beginPath();
    sketchBook.screen.moveTo(x, y);
    x += (xDir * 100);
    y += (yDir * 80 * (n === 1 ? 0.5 : 1));
    sketchBook.screen.lineTo(x, y);
    x += (xDir * 50);
    sketchBook.screen.lineTo(x, y);
    sketchBook.screen.stroke();
    sketchBook.screen.textAlign = xDir > 0 ? 'left' : 'right';
    sketchBook.screen.fillText(name, x + (xDir * 5), y,);

}

export function draw(sketchBook: SketchBook): void {
    if (activeName !== undefined) {
        checkCollision(activeName);
    }
    let mouseCollisions: [string, CollisionObject<Shape>][] = [];
    const mousePosition = sketchBook.mouse.getPosition();
    const mouseCircle = collider.circle(<ShapePoint>{x: mousePosition.x, y: mousePosition.y}, 5);
    mouseCollisions.length = 0;
    for (const item of shapes) {
        if (collider.isColliding(mouseCircle, item[1])) {
            mouseCollisions.push(item);
        }
    }

    sketchBook.clearScreen();
    sketchBook.screen.fillStyle = 'rgba(234,100,24,0.8)';
    drawShape(sketchBook, 'mouse', mouseCircle);
    for (const [name, shape] of shapes) {
        if (name !== activeName) {
            drawShape(sketchBook, name, shape);
        }
    }
    if (activeShape !== undefined) {
        drawShape(sketchBook, activeName, activeShape);
        drawLabel(sketchBook, activeName, activeShape);
    }
    for (const [name, shape] of mouseCollisions) {
        drawLabel(sketchBook, name, shape);
    }
}