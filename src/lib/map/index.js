import { Scene, PerspectiveCamera, WebGLRenderer, Color, Mesh, AmbientLight, AxesHelper, GridHelper } from 'three';
import { Interaction } from 'three.interaction';

import loader from '../loader';
import { MapControls } from '../controls';

function map () {
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new WebGLRenderer();
  const controls = new MapControls(camera, renderer.domElement);

  new Interaction(renderer, scene, camera);

  // helper
  const axesHelper = new AxesHelper(500);
  const gridHelper = new GridHelper(500, 50);
  
  // color
  const white = new Color(0xefefef);
  
  // light
  const ambient = new AmbientLight(0xffffff);

  /**
   * On WebGL context lost
   *
   * @param {Event} e
   * @return {void}
   */
  const onLost = (e) => {
    e.preventDefault();

    window.cancelAnimationFrame(frameID); 
  };

  /**
   * On WebGL context restored
   *
   * @return {void}
   */
  const onRestored = () => render();

  // add event listener
  renderer.context.canvas.addEventListener('webglcontextlost', onLost, false);
  renderer.context.canvas.addEventListener('webglcontextrestored', onRestored, false);

  // set up scene
  controls.object.position.set(0, 150, 0);
  controls.object.lookAt(scene.position);

  // set scence option
  scene.background = white;

  // add helper
  scene.add(axesHelper);
  scene.add(gridHelper);

  // add light
  scene.add(ambient);

  // variables
  let frameID = 0;
  let models = {};

  /**
   * Load map
   *
   * @param {Array<string>} items - the list of map name
   * @param {string} initial - initial map name
   * @param {function} onObjectClicked
   */
  const load = (items, initial, onObjectClicked) => {
    // load map
    items.map(async (name) => {
      const map = await loader.map(`/assets/map/${name}.json`);

      // load material
      map.traverse(async (child) => {
        if (child instanceof Mesh) {
          child.on('mouseup', onObjectClicked);
          child.on('touchend', onObjectClicked);
          
          child.cursor = 'pointer';
          child.material = await loader.texture(`/assets/texture/${name}/${child.material.name}.png`);
        }
      });

      if (initial !== name) map.visible = false;

      scene.add(map);
      models[name] = map;
    });
  };

  /**
   * Render
   *
   * @return {void}
   */
  const render = () => {
    frameID = window.requestAnimationFrame(render);

    controls.update();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  return {
    controls,
    camera,
    scene,
    renderer,

    // variables
    models,

    // public func
    render,
    load,
  };
}

export default map();
