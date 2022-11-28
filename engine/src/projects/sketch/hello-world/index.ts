import SketchBook from '../../../app/tools/sketch-book';

let cnt: number;
let state: number;

function reset(): void {
    cnt = 1;
    state = 0
}

export async function setup(sketchBook: SketchBook): Promise<void> {
    reset();
}

export function draw(sketchBook: SketchBook): void {
    cnt++;
    if (state === 0 && sketchBook.keyboard.isPressed(' ')) {
        state = 1;
        cnt = 0;
    } else if (state === 1 && sketchBook.keyboard.isReleased(' ')) {
        state = 0;
    }
    if (sketchBook.mouse.isLeftKeyDown()) {
        sketchBook.timer.stop();
        sketchBook.timer.start();
        reset();
    }

    const text = `Hello World! ${(cnt / 60).toFixed(1)}`;
    sketchBook.clearScreen('#DEDEDE');
    sketchBook.screen.strokeStyle = '#F00';
    sketchBook.screen.beginPath();
    sketchBook.screen.moveTo(sketchBook.SCREEN_WIDTH / 2, 0);
    sketchBook.screen.lineTo(sketchBook.SCREEN_WIDTH / 2, sketchBook.SCREEN_HEIGHT);
    sketchBook.screen.moveTo(0, sketchBook.SCREEN_HEIGHT / 2);
    sketchBook.screen.lineTo(sketchBook.SCREEN_WIDTH, sketchBook.SCREEN_HEIGHT / 2);
    sketchBook.screen.stroke();
    sketchBook.screen.font = '45px Helvetica';
    sketchBook.screen.textAlign = 'center';
    sketchBook.screen.textBaseline = 'middle';
    sketchBook.screen.fillStyle = '#009';
    sketchBook.screen.fillText(text, sketchBook.SCREEN_WIDTH / 2 - 1, sketchBook.SCREEN_HEIGHT / 2 - 1);
    sketchBook.screen.fillStyle = '#00F';
    sketchBook.screen.fillText(text, sketchBook.SCREEN_WIDTH / 2, sketchBook.SCREEN_HEIGHT / 2);
}