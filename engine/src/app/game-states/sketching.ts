import {DrawableInterface, GameStateInterface} from '../interfaces';
import GameStateMachine from '../tools/game-state-machine';
import SketchBook from '../tools/sketch-book';
import {GameContext, Sketch, SketchStatePayload} from '../types';

const CONTROLS_CONTAINER_ID = 'sketching_controls_container'; //variables.id;

export default class Sketching implements GameStateInterface<SketchStatePayload>, DrawableInterface {
    private context: GameContext;
    private sketch: Sketch;
    private sketchBook: SketchBook;

    draw(lag: number): void {
        this.sketch.draw(this.sketchBook);
    }

    async enter(context: GameContext, stateMachine: GameStateMachine, payload: SketchStatePayload): Promise<boolean> {
        context.display.ctx.clearRect(0, 0, context.display.width, context.display.height);
        Object.assign(context.container.style, {
            textAlign: 'left',
            color: '#FFF',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10px',
            width: context.display.width + 'px',
        });

        this.context = context;
        this.sketch = payload.sketch;
        this.sketchBook = new SketchBook(context);
        if ('setup' in this.sketch) {
            await this.sketch.setup(this.sketchBook);
        }
        return 'draw' in this.sketch
    }
}