import {GAME_STATE_UNDEFINED} from '../../app/constants';
import GamePlay from '../../app/game-states/game-play';
import {
    Game,
    GamePlayStatePayload,
    GameState,
    GameStateMachineConfig,
    GameStateMachineTransition
} from '../../app/types';
import AgentLevelFactory from './agent-level-factory';
import {STATE_GAME_PLAY} from './constants';

export default function init(): Game {
    const initialState = STATE_GAME_PLAY;
    const states: { [key: string]: GameState<object>; } = {};
    states[STATE_GAME_PLAY] = new GamePlay(new AgentLevelFactory());
    const transitions: GameStateMachineTransition[] = [
        {from: GAME_STATE_UNDEFINED, to: STATE_GAME_PLAY},
        {from: STATE_GAME_PLAY, to: STATE_GAME_PLAY}
    ];
    const initialStatePayload: GamePlayStatePayload = {level: '1'}
    const stateMachineConfig: GameStateMachineConfig = {states, transitions}
    return {initialState, initialStatePayload, stateMachineConfig};
}