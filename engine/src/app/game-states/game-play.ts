import {
    DrawableInterface,
    GameStateInterface,
    LevelFactoryInterface,
    TimerSensitiveInterface,
    UpdateableInterface
} from '../interfaces';
import {GameContext, GamePlayStatePayload, Level, TimerEvent} from '../types';
import GameStateMachine from "../tools/game-state-machine";

export default class GamePlay implements GameStateInterface<GamePlayStatePayload>, DrawableInterface, TimerSensitiveInterface, UpdateableInterface {
    private level: Level;
    private readonly levelFactory: LevelFactoryInterface;

    constructor(levelFactory: LevelFactoryInterface) {
        this.levelFactory = levelFactory;
    }

    draw(lag: number): void {
        this.level?.draw(lag);
    }

    async enter(context: GameContext, stateMachine: GameStateMachine, payload: GamePlayStatePayload): Promise<boolean> {
        this.level = await this.levelFactory.load(payload.level, context, stateMachine);
        return true;
    }

    shouldResetTimer(): boolean {
        return ('shouldResetTimer' in this.level) ? this.level.shouldResetTimer() : true;
    }

    update(timerEvent: TimerEvent): void {
        this.level?.update(timerEvent.duration);
    }
}