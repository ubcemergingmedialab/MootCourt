import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import PropTypes from 'prop-types';
import * as THREE from 'three';


function Model({ modelUrl, pos, rot, sca, pauseAnimation = true, animated }) {
  const [gltf, setGltf] = useState();
  const [mixer, setMixer] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      setGltf(gltf);
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        setMixer(mixer);
        const animationAction = mixer.clipAction(gltf.animations[0]);
        animationAction.setLoop(THREE.LoopRepeat);
        animationAction.clampWhenFinished = true;
        animationAction.timeScale = 1;
        animationAction.play();
      }
    });
  }, [modelUrl]);

  useFrame((state, delta) => {
    if (animated && mixer && !pauseAnimation) {
      mixer.update(delta);
    }
  });

  return gltf ? (
    <group position={pos} rotation={rot} scale={sca}>
      <primitive object={gltf.scene} />
    </group>
  ) : null;
}

Model.propTypes = {
  modelUrl: PropTypes.string,
  pos: PropTypes.any,
  rot: PropTypes.any,
  sca: PropTypes.any,
  pauseAnimation: PropTypes.bool,
  animated: PropTypes.bool,
};

export default Model;
