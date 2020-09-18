import { MapControls as NativeMapControls } from 'three/examples/jsm/controls/OrbitControls';


export class MapControls extends NativeMapControls {
  constructor (camera, dom) {
    super(camera, dom);

    this.minDistance = 50
    this.maxDistance = 150;

    this.minPolarAngle = 0.05;
    this.maxPolarAngle = 0.5;
  }
}