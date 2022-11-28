import {META_KEY} from '../../../app/tools/keyboard';
import SketchBook from '../../../app/tools/sketch-book';

enum STATE {
    ALIVE,
    DEAD,
}

type Cell = [STATE, STATE];

const size: number = 25;
const columns: number = 1360 / size | 0, rows: number = 765 / size | 0;
const step = 10;
let cells: Cell[][]
let cnt: number, gen: number;
let simulate: boolean, mouseDown: boolean;

function reset() {
    cells = [];
    for (let i = 0; i < rows; i++) {
        cells.push([]);
        for (let j = 0; j < columns; j++) {
            cells[i].push([STATE.DEAD, STATE.DEAD]);
        }
    }
    cnt = 0;
    gen = 0;
    simulate = false;
    mouseDown = false;
}

function liveNeighbours(i: number, j: number, gen: number): number {
    let n = 0;
    for (let ii = -1; ii <= 1; ii++) {
        let iii = (i + ii + rows) % rows;
        for (let jj = -1; jj <= 1; jj++) {
            if (ii === 0 && jj === 0) {
                continue;
            }
            let jjj = (j + jj + columns) % columns;
            if (cells[iii][jjj][gen] === STATE.ALIVE) {
                n++;
            }
        }
    }
    return n;
}

function proceed(sketchBook: SketchBook): void {
    if (sketchBook.keyboard.isPressed(' ')) {
        simulate = false;
        reset();
        return;
    }
    if (cnt % step === 0) {
        const old = gen;
        gen = (gen + 1) % 2;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const state = cells[i][j][old];
                let newState = state;
                let n = liveNeighbours(i, j, old);

                if (state === STATE.DEAD && n === 3) {
                    newState = STATE.ALIVE;
                } else if (state === STATE.ALIVE && (n < 2 || n > 3)) {
                    newState = STATE.DEAD;
                }
                cells[i][j][gen] = newState;
            }
        }
    }
    cnt++;
}

function handleInput(sketchBook: SketchBook): void {
    if (mouseDown && sketchBook.mouse.isLeftKeyReleased()) {
        mouseDown = false;
    } else if (sketchBook.mouse.isLeftKeyDown() && !mouseDown) {
        const position = sketchBook.mouse.getPosition();
        const x = (position.x / size) | 0;
        const y = (position.y / size) | 0;
        if (x >= 0 && x < columns && y >= 0 && y < rows) {
            cells[y][x][gen] = cells[y][x][gen] === STATE.DEAD ? STATE.ALIVE : STATE.DEAD;
        }

        mouseDown = true;
    }
    if (sketchBook.keyboard.isPressed('Enter')) {
        simulate = true;
    }
}

export async function setup(sketchBook: SketchBook): Promise<void> {
    reset();
}

export function draw(sketchBook: SketchBook): void {
    if (simulate) {
        proceed(sketchBook);
    } else {
        handleInput(sketchBook);
    }
    sketchBook.clearScreen();
    sketchBook.screen.fillStyle = '#FFF';
    sketchBook.screen.strokeStyle = '#555';
    sketchBook.screen.font = '15px Arial';
    sketchBook.screen.textBaseline = 'middle';
    sketchBook.screen.textAlign = 'center';
    const halfSize = size / 2 | 0

    if (!simulate) {
        sketchBook.screen.beginPath();
        for (let i = size; i < sketchBook.SCREEN_HEIGHT; i += size) {
            sketchBook.screen.moveTo(0, i);
            sketchBook.screen.lineTo(sketchBook.SCREEN_WIDTH, i);
        }
        for (let i = size; i < sketchBook.SCREEN_WIDTH; i += size) {
            sketchBook.screen.moveTo(i, 0);
            sketchBook.screen.lineTo(i, sketchBook.SCREEN_HEIGHT);
        }
        sketchBook.screen.stroke();
    }

    if (!simulate) {
        const position = sketchBook.mouse.getPosition();
        const x = (position.x / size) | 0;
        const y = (position.y / size) | 0;
        if (x < columns && y < rows) {
            sketchBook.screen.fillRect(x * size, y * size, size, size);
        }
    }
    for (let i = 0; i < rows; i++) {
        let y = i * size;
        for (let j = 0; j < columns; j++) {
            if (cells[i][j][gen] === STATE.ALIVE) {
                sketchBook.screen.fillStyle = '#FFF';
                sketchBook.screen.fillRect(j * size, y, size, size);
            }
            if (!simulate) {
                sketchBook.screen.fillStyle = 'rgba(255,0,0,0.5)';
                sketchBook.screen.fillText(liveNeighbours(i, j, gen).toString(), j * size + halfSize, y + halfSize);
            }
        }
    }


}