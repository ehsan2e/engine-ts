import * as shape from './shape'
import {
    CollisionObject,
    Shape,
    ShapeCircle,
    ShapeLine,
    ShapePoint,
    ShapePolygon,
    ShapeRectangle,
    ShapeTriangle,
    ShapeType
} from '../types';

type CollisionDetector = (shape1: Shape, shape2: Shape) => boolean;

function ccw(a: ShapePoint, b: ShapePoint, c: ShapePoint): number {
    return (c.y - a.y) * (b.x - a.x) - (b.y - a.y) * (c.x - a.x);
}

export function circleAndLineColliding(circle: ShapeCircle, line: ShapeLine): boolean {
    if (circleAndPointColliding(circle, line.start) || circleAndPointColliding(circle, line.end)) {
        return true;
    }
    const dotP = ((circle.center.x - line.start.x)*(line.end.x - line.start.x)) + ((circle.center.y - line.start.y)*(line.end.y - line.start.y));
    if(dotP <= 0){
        return false;
    }
    const l2 = Math.pow(line.end.x - line.start.x, 2)+ Math.pow(line.end.y - line.start.y, 2);

    const dotp2 = Math.pow(dotP, 2);
    if(dotp2 > l2 * l2){
        return false;
    }
    const a2 = dotp2 / l2;
    return  (Math.pow(circle.center.x - line.start.x, 2) + Math.pow(circle.center.y - line.start.y, 2)) - a2 <= Math.pow(circle.radius, 2);
}

export function circleAndPointColliding(circle: ShapeCircle, point: ShapePoint): boolean {
    return Math.pow(circle.center.x - point.x, 2) + Math.pow(circle.center.y - point.y, 2) <= Math.pow(circle.radius, 2);
}

export function circleAndPolygonColliding(circle: ShapeCircle, polygon: ShapePolygon): boolean {
    for (const line of polygon.lines) {
        if (circleAndLineColliding(circle, line)) {
            return true;
        }
    }
    return polygonAndPointColliding(polygon, circle.center);
}

export function circlesColliding(a: ShapeCircle, b: ShapeCircle): boolean {
    return Math.pow(a.center.x - b.center.x, 2) + Math.pow(a.center.y - b.center.y, 2) <= Math.pow(a.radius + b.radius, 2);
}


export function lineAndPointsColliding(line: ShapeLine, point: ShapePoint): boolean {
    return ccw(line.start, line.end, point) === 0;
}

export function linesColliding(a: ShapeLine, b: ShapeLine): boolean {
    const l1p2 = ccw(a.start, a.end, b.start);
    const l1q2 = ccw(a.start, a.end, b.end);
    if (l1p2 === 0 && l1q2 === 0) {
        return a.start.x <= b.end.x
            && a.end.x >= b.start.x
            && a.start.y <= b.end.y
            && a.end.y >= b.start.y;
    }
    const l2p1 = ccw(b.start, b.end, a.start);
    const l1q1 = ccw(b.start, b.end, a.end);
    return (l1p2 > 0) !== (l1q2 > 0) && (l2p1 > 0) !== (l1q1 > 0);
}

export function pointsColliding(a: ShapePoint, b: ShapePoint): boolean {
    return a.x === b.x && a.y === b.y
}

export function polygonAndLineColliding(polygon: ShapePolygon, line: ShapeLine): boolean {
    for (const l of polygon.lines) {
        if (linesColliding(l, line)) {
            return true;
        }
    }
    return false;
}

export function polygonAndPointColliding(polygon: ShapePolygon, point: ShapePoint): boolean {
    let x = Infinity;
    let y = Infinity;
    for (const line of polygon.lines) {
        x = Math.min(line.start.x, line.end.x, x);
        y = Math.min(line.start.y, line.end.y, y);
    }
    const line: ShapeLine = {start: {x: x - 5, y: y - 5}, end: point};
    let n = 0;
    for (const l of polygon.lines) {
        if (linesColliding(l, line)) {
            n++
        }
    }
    return n % 2 === 1;
}

export function polygonsColliding(a: ShapePolygon, b: ShapePolygon): boolean {
    for (const point of b.points) {
        if (polygonAndPointColliding(a, point)) {
            return true;
        }
    }
    for (const point of a.points) {
        if (polygonAndPointColliding(b, point)) {
            return true;
        }
    }
    return false;
}

export function rectangleAndPointColliding(rectangle: ShapeRectangle, point: ShapePoint): boolean {
    return point.x >= rectangle.points[0].x
        && point.y >= rectangle.points[0].y
        && point.x <= rectangle.points[2].x
        && point.y <= rectangle.points[2].y
}

export function rectanglesColliding(a: ShapeRectangle, b: ShapeRectangle): boolean {
    return a.points[0].x <= b.points[2].x
        && a.points[2].x >= b.points[0].x
        && a.points[0].y <= b.points[2].y
        && a.points[2].y >= b.points[0].y
}

const collisionDetectors: { [key: string]: CollisionDetector } = {};

collisionDetectors[`${ShapeType.CIRCLE}-${ShapeType.CIRCLE}`] = circlesColliding;
collisionDetectors[`${ShapeType.CIRCLE}-${ShapeType.LINE}`] = circleAndLineColliding;
collisionDetectors[`${ShapeType.CIRCLE}-${ShapeType.POINT}`] = circleAndPointColliding;
collisionDetectors[`${ShapeType.CIRCLE}-${ShapeType.POLYGON}`] = circleAndPolygonColliding;

collisionDetectors[`${ShapeType.LINE}-${ShapeType.LINE}`] = linesColliding;
collisionDetectors[`${ShapeType.LINE}-${ShapeType.POINT}`] = lineAndPointsColliding;

collisionDetectors[`${ShapeType.POINT}-${ShapeType.POINT}`] = pointsColliding;

collisionDetectors[`${ShapeType.POLYGON}-${ShapeType.LINE}`] = polygonAndLineColliding;
collisionDetectors[`${ShapeType.POLYGON}-${ShapeType.POINT}`] = polygonAndPointColliding;
collisionDetectors[`${ShapeType.POLYGON}-${ShapeType.POLYGON}`] = polygonsColliding;
collisionDetectors[`${ShapeType.POLYGON}-${ShapeType.RECTANGLE}`] = polygonsColliding;

collisionDetectors[`${ShapeType.RECTANGLE}-${ShapeType.POINT}`] = rectangleAndPointColliding;
collisionDetectors[`${ShapeType.RECTANGLE}-${ShapeType.RECTANGLE}`] = rectanglesColliding;

const dropIn: { [key: string]: ShapeType; } = {};
dropIn[ShapeType.RECTANGLE] = ShapeType.POLYGON;
dropIn[ShapeType.TRIANGLE] = ShapeType.POLYGON;

export function isColliding(a: CollisionObject<Shape>, b: CollisionObject<Shape>): boolean {
    let key = `${a.type}-${b.type}`;
    if (key in collisionDetectors) {
        return collisionDetectors[key](a.shape as Shape, b.shape as Shape);
    }

    key = `${b.type}-${a.type}`;
    if (key in collisionDetectors) {
        return collisionDetectors[key](b.shape as Shape, a.shape as Shape);
    }

    if (a.type in dropIn) {
        const aType = dropIn[a.type];
        key = `${aType}-${b.type}`;
        if (key in collisionDetectors) {
            return collisionDetectors[key](a.shape as Shape, b.shape as Shape);
        }
        key = `${b.type}-${aType}`;
        if (key in collisionDetectors) {
            return collisionDetectors[key](b.shape as Shape, a.shape as Shape);
        }
        if (b.type in dropIn) {
            const bType = dropIn[b.type];
            key = `${aType}-${bType}`;
            if (key in collisionDetectors) {
                return collisionDetectors[key](a.shape as Shape, b.shape as Shape);
            }
        }
    }

    if (b.type in dropIn) {
        const bType = dropIn[b.type];
        key = `${a.type}-${bType}`;
        if (key in collisionDetectors) {
            return collisionDetectors[key](a.shape as Shape, b.shape as Shape);
        }
        key = `${bType}-${a.type}`;
        if (key in collisionDetectors) {
            return collisionDetectors[key](b.shape as Shape, a.shape as Shape);
        }
        if (a.type in dropIn) {
            const aType = dropIn[a.type];
            key = `${bType}-${aType}`;
            if (key in collisionDetectors) {
                return collisionDetectors[key](b.shape as Shape, a.shape as Shape);
            }
        }
    }

    console.warn(`Cannot detect collision between ${a.type} and ${b.type}`, a, b);
    return undefined;
}

export function circle(center: ShapePoint, radius: number): CollisionObject<ShapeCircle> {
    return {shape: shape.circle(center, radius), type: ShapeType.CIRCLE}
}

export function line(start: ShapePoint, end: ShapePoint): CollisionObject<ShapeLine> {
    return {shape: shape.line(start, end), type: ShapeType.LINE};
}

export function point(x: number, y:number): CollisionObject<ShapePoint> {
    return {shape: shape.point(x, y), type: ShapeType.POINT};
}

export function polygon(points: ShapePoint[]): CollisionObject<ShapePolygon> {
    return {shape: shape.polygon(points), type: ShapeType.POLYGON};
}

export function rectangle(start: ShapePoint, width:number, height: number): CollisionObject<ShapeRectangle> {
    return {shape: shape.rectangle(start, width, height), type: ShapeType.RECTANGLE};
}

export function triangle(first: ShapePoint, second: ShapePoint, third: ShapePoint): CollisionObject<ShapeTriangle> {
    return {shape: shape.triangle(first, second, third), type: ShapeType.TRIANGLE};
}

