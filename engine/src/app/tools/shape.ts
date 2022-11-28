import {ShapeCircle, ShapeLine, ShapePoint, ShapePolygon, ShapeRectangle, ShapeTriangle} from '../types';

export function circle(center: ShapePoint, radius: number): ShapeCircle {
    return {center, radius};
}

export function line(start: ShapePoint, end: ShapePoint): ShapeLine {
    return {start, end};
}

export function moveCircle(circle: ShapeCircle, offsetX: number, offsetY: number): void {
    circle.center.x += offsetX;
    circle.center.y += offsetY;
}

export function moveLine(line: ShapeLine, offsetX: number, offsetY: number): void {
    line.start.x += offsetX;
    line.start.y += offsetY;
    line.end.x += offsetX;
    line.end.y += offsetY;
}

export function movePoint(point: ShapePoint, offsetX: number, offsetY: number): void {
    point.x += offsetX;
    point.y += offsetY;
}

export function movePolygon(polygon: ShapePolygon, offsetX: number, offsetY: number): void {
    for (const point of polygon.points) {
        point.x += offsetX;
        point.y += offsetY;
    }
}

export function point(x: number, y: number): ShapePoint {
    return {x, y};
}

export function polygon(points: ShapePoint[]): ShapePolygon {
    const polygon: ShapePolygon = {
        lines: [],
        points: points,
    };

    const l = points.length;
    for (let i = 0; i < l; i++) {
        polygon.lines.push(line(points[i], points[(i + 1) % l]));
    }
    return polygon;
}

export function rectangle(start: ShapePoint, width: number, height: number): ShapeRectangle {
    const poly = polygon([
        start,
        {x: start.x + width, y: start.y},
        {x: start.x + width, y: start.y + height},
        {x: start.x, y: start.y + height},
    ]);

    return {
        height,
        lines: <[ShapeLine, ShapeLine, ShapeLine, ShapeLine]>poly.lines,
        points: <[ShapePoint, ShapePoint, ShapePoint, ShapePoint]>poly.points,
        position: start,
        width
    }
}

export function triangle(first: ShapePoint, second: ShapePoint, third: ShapePoint): ShapeTriangle {
    return polygon([first, second, third]) as ShapeTriangle;
}