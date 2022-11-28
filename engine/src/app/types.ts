import {
    DrawableInterface,
    GameStateInterface,
    LeavingInterface,
    LevelInterface,
    TimerSensitiveInterface,
    UpdateableInterface
} from './interfaces';
import Camera from './tools/camera';
import Debugger from './tools/debugger';
import EventEmitter from './tools/event-emitter';
import {Vec2D} from './tools/helpers';
import Keyboard from './tools/keyboard';
import Mouse from './tools/mouse';
import SketchBook from './tools/sketch-book';
import Timer from './tools/timer';
import QuadTree from "./tools/quad-tree";

export enum KeyState {
    PRESSED,
    RELEASED,
}

export enum MouseKey {
    LEFT,
    RIGHT,
}

export enum MouseKeyState {
    NEUTRAL,
    PRESSED,
    RELEASED,
}

export enum ShapeType {
    CIRCLE = 'CIRCLE',
    LINE = 'LINE',
    POLYGON = 'POLYGON',
    POINT = 'POINT',
    RECTANGLE = 'RECTANGLE',
    TRIANGLE = 'TRIANGLE',
}

export type Display = {
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
}

export type DisplayLayer = (camera: Camera, lag: number) => void;

export type QuadTreeEntity = {
    id: number,
    path: string,
    point: ShapePoint,
}

export type QuadTreeEntityCollection = {
    entities: QuadTreeEntity[],
    point: ShapePoint,
}

export type Game = {
    initialState: string,
    initialStatePayload: object,
    stateMachineConfig: GameStateMachineConfig,
}

export type GameContext = {
    container: HTMLDivElement,
    debug: boolean,
    debugger: Debugger,
    display: Display,
    keyboard: Keyboard,
    mouse: Mouse,
    timer: Timer,
}

export type GameState<T> =
    GameStateInterface<T>
    & ({} | DrawableInterface | LeavingInterface | TimerSensitiveInterface | UpdateableInterface);

export type GamePlayStatePayload = {
    level: string,
}

export type GameStateMachineConfig = {
    states: { [key: string]: GameState<object>; },
    transitions: GameStateMachineTransition[],
}

export type GameStateMachineTransition = {
    from: string,
    to: string,
}

export type Level = LevelInterface & ({} | TimerSensitiveInterface)

export type MouseInfo = {
    left: MouseKeyState,
    position: Vec2D,
    right: MouseKeyState,
}

export type NullStatePayload = {}

export type ShapeCircle = {center: ShapePoint, radius: number};
export type ShapeLine = {start:ShapePoint, end:ShapePoint};
export type ShapePoint = {x:number, y:number};
export type ShapePolygon = {lines: ShapeLine[], points: ShapePoint[]};
export type ShapeRectangle = {
    height: number,
    lines: [ShapeLine, ShapeLine, ShapeLine, ShapeLine],
    points: [ShapePoint, ShapePoint, ShapePoint, ShapePoint],
    position: ShapePoint,
    width: number
};
export type ShapeTriangle = {lines: [ShapeLine, ShapeLine, ShapeLine], points: [ShapePoint, ShapePoint, ShapePoint]};
export type Shape = ShapeCircle | ShapeLine | ShapePoint | ShapePolygon;

export type CollisionObject<T> = {
    type: ShapeType,
    shape: T,
}

export type Sketch = {
    draw?: (sketchBook: SketchBook) => void,
    setup?: (sketchBook: SketchBook) => Promise<void>,
}

export type SketchStatePayload = {
    sketch: Sketch,
}

export type BufferResolver = () => HTMLCanvasElement;

export type TimerConfig = {
    eventEmitter: EventEmitter;
    frameRate: number,
    maxIntervals: number;
}

export type TimerEvent = {
    duration: number
    epochTime: number,
    intervals: number,
    lag: number,
    time: number,
}
