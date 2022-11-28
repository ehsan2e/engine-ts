import {TAG_RENDERABLE} from '../constants';
import {RenderableInterface} from '../interfaces';
import EntityManager from '../tools/entity-manager';
import Camera from "../tools/camera";

export default class EntityLayer<T> {
    private readonly entityManager: EntityManager<T>;
    private readonly tag: string;

    constructor(entityManager: EntityManager<T>, tag: string = TAG_RENDERABLE) {
        this.entityManager = entityManager;
        this.tag = tag;
    }

    render(camera: Camera): void {
        for(let entity of this.entityManager.iterator(this.tag)) {
            camera.capture((entity as RenderableInterface).getRenderUnit());
        }
    }
}
