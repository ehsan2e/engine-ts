import {DisplayLayer} from '../types';
import Camera from './camera';

type LayerEntry = { layer: DisplayLayer, depth: number };

export default class DisplayCompositor {
    private layers: LayerEntry[] = [];

    addLayer(layer: DisplayLayer, depth = 0): void {
        this.layers.push({layer, depth});
        this.layers.sort((a: LayerEntry, b: LayerEntry) => a.depth - b.depth);
    }

    draw(camera: Camera, lag: number): void {
        camera.clear();
        for (let entry of this.layers) {
            entry.layer(camera, lag);
        }
    }
}