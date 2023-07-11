import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import PropTypes from 'prop-types';
import * as THREE from 'three';

function Model({ modelUrl, pos, rot, sca, pauseAnimation = true, animated }) {
  const [gltf, setGltf] = useState();
  const [mixer, setMixer] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      setGltf(gltf);
      if (gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        setMixer(mixer);
        const newAnimations = gltf.animations.map((clip) => {
          const action = mixer.clipAction(clip);
          action.clampWhenFinished = true;
          action.setLoop(THREE.LoopOnce);
          action.clampWhenFinished = true;
          action.timeScale = 1;
          return {
            action,
            duration: clip.duration, // Store the duration of each animation clip
          };
        });
        setAnimations(newAnimations);
      }
    });
  }, [modelUrl]);

  useFrame((state, delta) => {
    if (animated && mixer && !pauseAnimation) {
      mixer.update(delta);
    }
  });

  useEffect(() => {
    if (animations.length > 0) {
      const interval = setInterval(() => {
        setCurrentAnimationIndex((prevIndex) => {
          const currentIndex = prevIndex + 1 >= animations.length ? 0 : prevIndex + 1;
          const currentAnimation = animations[currentIndex];
          const previousAnimation = animations[prevIndex];
          previousAnimation.action.stop(); // Stop the previous animation
          currentAnimation.action.reset(); // Reset the current animation
          currentAnimation.action.play(); // Play the current animation
          return currentIndex;
        });
      }, animations[currentAnimationIndex].duration * 1000); // Multiply duration by 1000 to convert to milliseconds
      return () => clearInterval(interval);
    }
  }, [animations, currentAnimationIndex]);

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
