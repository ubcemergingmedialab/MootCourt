import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import PropTypes from 'prop-types';
import * as THREE from 'three';

// Helper function to shuffle the array randomly
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function Model({ modelUrl, pos, rot, sca, isSpeaking = true, pauseAnimation = true, animated }) {
  const [gltf, setGltf] = useState();
  const [mixer, setMixer] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const intervalRef = useRef(null);

  // Function to stop all random animation clips
  const stopRandomAnimations = () => {
    const randomClips = animations.filter(
      (clip) => clip.action.getClip().name !== 'talking'
    );
    randomClips.forEach((clip) => {
      clip.action.fadeOut(1, () => {
        clip.action.reset(); // Reset the animation state
        clip.action.stop(); // Stop the currentClip once its fade-out is complete
      });
    });
  };

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
          action.clampWhenFinished = true;
          action.timeScale = 1;
          return {
            action,
            duration: clip.duration,
          };
        });
        setAnimations(newAnimations);
        console.log('Animation Clips:', gltf.animations);
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
      const crossfadeDuration = 1;
      const speakingClip = animations.find((clip) => clip.action.getClip().name === 'talking');
      const randomClips = animations.filter(
        (clip) => clip.action.getClip().name !== 'talking'
      );

      if (isSpeaking) {
        if (speakingClip) {
          setCurrentAnimationIndex(0);
          speakingClip.action.setLoop(THREE.LoopRepeat);
          speakingClip.action.reset();
          speakingClip.action.fadeIn(crossfadeDuration);
          speakingClip.action.play();
          console.log('Current Animation Clips:', [speakingClip.action.getClip().name]);

          stopRandomAnimations();
        }
      } else {
        speakingClip.action.fadeOut(crossfadeDuration, () => {
          speakingClip.action.stop();
        });
        stopRandomAnimations();
        shuffleArray(randomClips);

        setCurrentAnimationIndex(0);

        const playNextRandomAnimation = () => {
          setCurrentAnimationIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % randomClips.length;
            const currentClip = randomClips[prevIndex];
            const nextClip = randomClips[nextIndex];

            currentClip.action.fadeOut(crossfadeDuration, () => {
              currentClip.action.reset(); // Reset the animation state
              currentClip.action.stop(); // Stop the currentClip once its fade-out is complete
            });

            nextClip.action.reset(); // Reset the next animation state
            nextClip.action.setLoop(THREE.LoopOnce); // Set looping mode
            nextClip.action.fadeIn(crossfadeDuration);
            nextClip.action.play();

            console.log('Current Animation Clip:', nextClip.action.getClip().name);

            return nextIndex;
          });
        };

        intervalRef.current = setInterval(
          playNextRandomAnimation,
          randomClips[0].duration * 1000
        );

        randomClips[0].action.fadeIn(crossfadeDuration);
        randomClips[0].action.play();

        return () => {
          clearInterval(intervalRef.current);
          setCurrentAnimationIndex(0);
        };
      }
    }
  }, [animations, isSpeaking]);

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
  isSpeaking: PropTypes.bool,
};

export default Model;
