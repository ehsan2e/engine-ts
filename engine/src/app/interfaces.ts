import GameStateMachine from './tools/game-state-machine';
import {GameContext, Level, MouseInfo, TimerEvent} from './types';
import {Vec2D} from "./tools/helpers";
import RenderUnit from "./tools/render-unit";

export interface DynamicInterface {
    update(deltaT: number): void
}

export interface DrawableInterface {
    draw(lag: number): void
}

export interface GameStateInterface<T> {
    enter(context: GameContext, stateMachine: GameStateMachine, payload: T): Promise<boolean>;
}

export interface LeavingInterface {
    leave(): void;
}

export interface LevelInterface extends DrawableInterface, DynamicInterface{}

export interface LevelFactoryInterface {
    load(name: string, context: GameContext, stateMachine: GameStateMachine): Promise<Level>;
}

export interface MouseInterface {
    getPosition(): Vec2D;

    isLeftKeyDown(): boolean;

    isLeftKeyReleased(): boolean;

    isRightKeyDown(): boolean;

    isRightKeyReleased(): boolean;

    read(): MouseInfo ;
}

export interface TimerSensitiveInterface {
    shouldResetTimer(): boolean;
}

export interface UpdateableInterface {
    update(timerEvent: TimerEvent): void;
}

export interface RenderableInterface {
    getRenderUnit(): RenderUnit
}

