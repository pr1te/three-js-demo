import { ObjectLoader } from 'three';

/**
 * Map loader
 *
 * @param {string} path - map path
 * @return {Promise<any>}
 */
function map (path) {
  const loader = new ObjectLoader();

  return new Promise((resolve) => {
    const onLoaded = (map) => resolve(map);
    const onProgress = () => {};
    const onError = (error) => console.error(error);

    loader.load(path, onLoaded, onProgress, onError);
  });
}

export default map;
