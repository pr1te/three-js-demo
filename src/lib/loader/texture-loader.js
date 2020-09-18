import { TextureLoader, MeshLambertMaterial, RepeatWrapping } from 'three';

/**
 * Texture loader
 *
 * @param {string} path - texture path
 * @return {Promise<any>}
 */
function texture (path) {
  const loader = new TextureLoader();

    return new Promise((resolve) => {
      const onLoaded = (texture) => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        const material = new MeshLambertMaterial({ map: texture, transparent: true });

        resolve(material);
      };

      const onProgress = () => {};
      const onError = () => {};

      loader.load(path, onLoaded, onProgress, onError);
    });
}

export default texture;
