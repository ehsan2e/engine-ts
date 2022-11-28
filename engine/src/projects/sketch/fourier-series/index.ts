import {transpose, Vec2D} from '../../../app/tools/helpers';
import SketchBook from '../../../app/tools/sketch-book';

declare global{
    interface Window {
        lerp: Function
    }
}
window.lerp = transpose;

const TWO_PI = 2 * Math.PI;
const ANGLE_SPEED = 1 / (TWO_PI * 50);
const RADIUS = 100;
const MAX_POINTS = 800;

let t = 0;
let points: number[] = [];

export function draw(sketchBook: SketchBook): void {
    const center = new Vec2D(250, sketchBook.SCREEN_HEIGHT / 2);
    t += ANGLE_SPEED;
    sketchBook.clearScreen('#FFF');
    sketchBook.screen.strokeStyle = '#999';

    sketchBook.screen.beginPath();
    for (let i = 0; i < 25; i++) {
        const n = 2 * i + 1;
        sketchBook.screen.beginPath();
        const R = RADIUS / n;
        sketchBook.screen.arc(center.x, center.y, R, 0, TWO_PI);
        sketchBook.screen.stroke();
        const angle = (n * t * TWO_PI);
        const p = new Vec2D(R * Math.cos(angle), R * Math.sin(angle));
        sketchBook.screen.moveTo(center.x, center.y);
        sketchBook.screen.lineTo(center.x + p.x, center.y - p.y);
        sketchBook.screen.stroke();
        center.set(center.x + p.x, center.y - p.y);
    }
    points.unshift(center.y);
    points.length = MAX_POINTS;


    const l = points.length
    const offset = 600;
    sketchBook.screen.beginPath();
    sketchBook.screen.moveTo(center.x, center.y);
    for (let i = 0; i < l; i++) {
        const alpha = transpose(i, 0, MAX_POINTS, 1, 0).toFixed(2);
        const blue = transpose(i, 0, MAX_POINTS, 255, 0) | 0;
        const green = transpose(i, 0, MAX_POINTS, 0, 255) | 0;
        sketchBook.screen.strokeStyle = `rgba(30,${green},${blue}, ${alpha})`;
        sketchBook.screen.lineTo(offset + i, points[i]);
        sketchBook.screen.stroke();
        if(i+1 < l){
            sketchBook.screen.beginPath();
            sketchBook.screen.moveTo(offset + i, points[i]);
        }
    }
}