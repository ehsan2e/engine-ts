import {TAG_RENDERABLE} from '../../app/constants';
import {DynamicInterface, LevelInterface} from '../../app/interfaces';
import EntityLayer from '../../app/layer/entity-layer';
import Camera from '../../app/tools/camera';
import {Box, createCanvas, Vec2D} from '../../app/tools/helpers';
import {DisplayLayer, GamePlayStatePayload} from '../../app/types';
import {STATE_GAME_PLAY} from './constants';
import Player from './player';
import {AgentLevelConfig, Entity} from './type';
import RenderUnit from "../../app/tools/render-unit";

const TAG_DYNAMIC = 'dynamic';

export default class AgentLevel implements LevelInterface {
    private readonly config: AgentLevelConfig<Entity>;
    private readonly sceneHeight: number;
    private readonly sceneWidth: number;

    constructor(config: AgentLevelConfig<Entity>) {
        this.config = config
        this.sceneWidth = this.config.context.display.width * 10
        this.sceneHeight = this.config.context.display.height * 10;
        this.config.camera.setScene(
            new Box(
                new Vec2D(0, 0),
                new Vec2D(this.sceneWidth, this.sceneHeight)
            )
        );
    }

    draw(lag: number): void {
        this.config.compositor.draw(this.config.camera, lag);
    }

    private loadScheduler(): void {
        this.update = (deltaT: number): void => {
            this.config.scheduler.update(deltaT);
            for(let entity of this.config.entityManager.iterator(TAG_DYNAMIC)){
                (entity as DynamicInterface).update(deltaT);
            }
        }
        const i: number = Number(this.config.name) | 0;
        const interval: number = Math.max(1000 - i * 25, 20);
        const lifeExpectancy = 2500;
        for (let j = 0; j < i; j++) {
            const id: string = 'player ' + j;
            if (j === 0) {
                this.config.entityManager.add(id, Player.make(j) as Entity, [TAG_RENDERABLE, TAG_DYNAMIC])
            } else {
                this.config.scheduler.schedule(
                    interval * j,
                    (): void => this.config.entityManager.add(id, Player.make(j) as Entity, [TAG_RENDERABLE, TAG_DYNAMIC])
                );
            }
            this.config.scheduler.schedule(lifeExpectancy + (interval * j), (): void => this.config.entityManager.remove(id));
        }
        this.config.scheduler.schedule(
            lifeExpectancy + (interval * (i - 1)),
            (): void => {
                const payload: GamePlayStatePayload = {level: `${i + 1}`}
                this.config.stateMachine.switchState(STATE_GAME_PLAY, payload).then();
            }
        );
    }

    private loadNavigation() {
        const player = Player.make(1);
        this.config.entityManager.add('player', player as Entity, [TAG_RENDERABLE, TAG_DYNAMIC]);
        const focusBox = Box.make(
            200,
            100,
            this.config.context.display.width - 400,
            this.config.context.display.height - 200
        );
        const subject = new Box(player.getPosition(), player.size);
        this.config.camera.follow(focusBox, subject);
        this.update = (deltaT: number): void => {
            const player = this.config.entityManager.get('player');
            if (player instanceof Player) {
                player.navigate(this.config.context.keyboard, this.config.camera.getMouse());
                player.update(deltaT);
                if (player.getPosition().x > this.sceneWidth || player.getPosition().y > this.sceneHeight) {
                    this.config.entityManager.remove('player');
                    this.config.context.timer.stop();
                }
            }
        }
    }

    async load(): Promise<void> {
        this.loadNavigation();
        // this.loadScheduler();
        this.config.compositor.addLayer((function (buffer: HTMLCanvasElement): DisplayLayer {
            return function (camera: Camera): void {
                camera.capture(
                    new RenderUnit(
                        buffer,
                        camera.position,
                        function (ctx: CanvasRenderingContext2D): void {
                            const captureArea = camera.getCaptureArea();
                            const gridSize = 100;
                            ctx.clearRect(0,0, captureArea.width, captureArea.height);
                            ctx.strokeStyle = 'rgb(50,50,50)';
                            let n1 = 0;
                            let n2 = 0;
                            ctx.beginPath();
                            for (let x = (Math.ceil(captureArea.left / gridSize) * gridSize - captureArea.left) | 0; x < captureArea.width; x += gridSize) {
                                ctx.moveTo(x, 0);
                                ctx.lineTo(x, captureArea.height);
                                n1++;
                            }
                            for (let y = (Math.ceil(captureArea.top / gridSize) * gridSize - captureArea.top) | 0; y < captureArea.height; y += gridSize) {
                                ctx.moveTo(0, y);
                                ctx.lineTo(captureArea.width, y);
                                n2++;
                            }
                            ctx.moveTo(0, 0);
                            ctx.lineTo(captureArea.width, captureArea.height);
                            ctx.stroke();
                        }
                    )
                );
            }
        })(createCanvas(this.config.context.display.width, this.config.context.display.height)));
        this.config.compositor.addLayer(((buffer: HTMLCanvasElement) => {
            const c: CanvasRenderingContext2D = buffer.getContext('2d');
            c.fillStyle = '#FFF';
            c.font = '30px Helvetica';
            c.fillText(`Level: ${this.config.name}`, 10, buffer.height / 2);
            c.textBaseline = 'middle';
            const renderUnit = new RenderUnit(buffer, new Vec2D(0, 0))
            return (camera: Camera): void => {
                camera.capture(renderUnit);
            }
        })(createCanvas(200, 100)));
        const layer = new EntityLayer(this.config.entityManager);
        this.config.compositor.addLayer(layer.render.bind(layer), 0);
    }

    update(deltaT: number): void {
        throw Error(`What the ...! ${deltaT}`);
    }
}