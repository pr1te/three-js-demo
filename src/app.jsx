/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useRef } from 'react';

import { Vector3, BoxGeometry, MeshBasicMaterial, Mesh, Color } from 'three';

import { MapIndicator } from './components';

import map from './lib/map';

/**
 * Application root
 *
 * @return {JSX.Element}
 */
function App () {
  // const [ maps ] = useState([ 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7' ]);
  const [ maps ] = useState([ 'F1' ]);
  const [ current, setCurrent ] = useState('F1');

  // for debugging
  const [ position, setPosition ] = useState({ x: 0, y: 0, z: 0 });

  const count = useRef(0);
  const countID = useRef(null);

  /**
   * Handle on map is changed
   *
   * @param {string} target - map target
   * @return {void}
   */
  const handleOnMapChanged = (target) => {
    setCurrent(target);

    // hide the previous map
    map.models[current].visible = false;

    // display the target map 
    map.models[target].visible = true;
  };

  const handleOnObjectClicked = (e) => {
    count.current += 1;
    
    if (count.current === 2) {
      count.current = 0; 

      const { parent } = e.target;
      const { center } = e.target.geometry.boundingSphere;

      const position = new Vector3(
        parent.position.x + center.x,
        parent.position.y + center.y,
        parent.position.z + center.z,
      );

      const camPosition = new Vector3(position.x, 50, position.z);

      // object for debug
      const geometry = new BoxGeometry();

      // the green box
      const targetObject = new Mesh(geometry, new MeshBasicMaterial({ color: 0x00ff00 }));

      // the black box
      const cameraObject = new Mesh(geometry, new MeshBasicMaterial({ color: new Color('black') }));

      targetObject.position.set(position.x, position.y + 5, position.z);
      map.scene.add(targetObject);

      cameraObject.position.set(camPosition.x, camPosition.y, camPosition.z);
      map.scene.add(cameraObject);
      // end of debug

      e.target.material = new MeshBasicMaterial({ color: new Color('orange') })

      map.controls.reset();
      map.controls.target.set(position.x, position.y, position.z);
      map.camera.position.copy(camPosition)
    } else {
      if (countID.current) clearTimeout(countID.current);
      countID.current = setTimeout(() => count.current = 0, 300);
    }
  };

  // camera controls event listener
  useEffect(() => {
    const onChange = ({ target }) => {
      const { x, y, z } = target.object.position;

      setPosition({ x, y, z });
    };

    map.controls.addEventListener('change', onChange, false);

    return () => {
      map.controls.removeEventListener('change', onChange, false);
    };
  }, []);

  useEffect(() => {
    map.load(maps, current, handleOnObjectClicked);
    map.render();
    
    document.getElementById('main').appendChild(map.renderer.domElement);
  }, [])

  return (
    <div id="main" style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 50, left: 50 }}>
        <h1 className='title'>{current}</h1>
      </div>

      <div style={{ position: 'absolute', top: 50, right: 50 }}>
        <MapIndicator
          items={maps}
          active={current}
          onChange={handleOnMapChanged}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 50, right: 50 }}>
        <span>{`x: ${position.x} y: ${position.y} z: ${position.z}`}</span>
      </div>
    </div>
  );
}

export default App;
