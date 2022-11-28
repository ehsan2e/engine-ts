import SketchBook from '../../../app/tools/sketch-book';
import Boid from './boid';

let boid: Boid;

function paint(sketchBook: SketchBook) {
    sketchBook.clearScreen();
    boid.draw(sketchBook);
}

function update(sketchBook: SketchBook) {
    const position = sketchBook.mouse.getPosition();
    boid.acceleration.addVec2D(boid.seek(position.x, position.y, 80));
    boid.update(sketchBook);
}

export async function setup(sketchBook: SketchBook): Promise<void> {
    boid = new Boid();
    boid.position.set(sketchBook.SCREEN_HORIZONTAL_CENTER, sketchBook.SCREEN_VERTICAL_CENTER);
}

export async function draw(sketchBook: SketchBook): Promise<void> {
    update(sketchBook);
    paint(sketchBook);
}