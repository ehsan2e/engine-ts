import './theme.scss';
import GameStateMachine from './app/tools/game-state-machine';
import {createGameContext, createGameFromSketch} from './app/tools/helpers';
import Mouse from './app/tools/mouse';
import {Display, Game} from './app/types';
import * as sketches from './projects/sketch'
import initAgentGame from './projects/agent'

declare global {
    interface Window {
        gameStateMachine: GameStateMachine;
    }
}

const canvas: HTMLCanvasElement = document.querySelector('canvas');
const container: HTMLDivElement = document.getElementById('container') as HTMLDivElement;
const resolution = 16 / 9;
const width = 1360;
const height = (width / resolution) | 0;
canvas.width = width;
canvas.height = height;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const display: Display = {ctx, width, height};
const frameRate = 60;
const maxTimerIntervals = 80;
let debug = false;
if (process.env.NODE_ENV === 'production') {
    debug = false;
}

const mouse = new Mouse();
mouse.attach(canvas);
const gameContext = createGameContext(container, display, mouse, frameRate, debug, maxTimerIntervals);
let games: { name: string, game: Game }[] = [
    {name: 'agent', game: initAgentGame()},
];

for (const [identifier, sketch] of Object.entries(sketches)){
    games.push({
        name: ('sketch' + identifier).replace(/([A-Z])/g, (m)=> '-' + m.toLowerCase()),
        game: createGameFromSketch(sketch)
    });
}

function run(project: string = 'agent') {
    const item = games.find(({name}: { name: string, game: Game }): boolean => {
        return name === project;
    });

    const game: Game = item === undefined ? games[0].game : item.game;

    gameContext.timer.detachAll();
    const gameStateMachine = new GameStateMachine(gameContext, game.stateMachineConfig);
    if (debug) {
        window.gameStateMachine = gameStateMachine;
    }
    gameStateMachine.switchState(game.initialState, game.initialStatePayload).catch(console.error.bind(console));
};

['load', 'hashchange'].forEach(
    function (eventName) {
        window.addEventListener(eventName, function () {
            run(window.location.hash.substring(1));
        });
    }
);
