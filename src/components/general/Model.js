import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import PropTypes from 'prop-types';
import * as THREE from 'three';

function Model({ modelUrl, pos, rot, sca, isSpeaking = true, pauseAnimation = true, animated }) {
  const [gltf, setGltf] = useState();
  const [mixer, setMixer] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const intervalRef = useRef(null);

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

      if (isSpeaking) {
        const speakingClip = animations.find((clip) => clip.action.getClip().name === 'talking');

        if (speakingClip) {
          setCurrentAnimationIndex(0);
          speakingClip.action.reset();
          speakingClip.action.fadeIn(crossfadeDuration);
          speakingClip.action.play();
          console.log('Current Animation Clips:', [speakingClip.action.getClip().name]);
        }
      } else {
        const randomClips = animations.filter(
          (clip) => clip.action.getClip().name !== 'talking');

        setCurrentAnimationIndex(0);

        // Helper function to play the next random animation
        const playNextRandomAnimation = () => {
          setCurrentAnimationIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % randomClips.length;
            const currentClip = randomClips[prevIndex];
            const nextClip = randomClips[nextIndex];

            currentClip.action.fadeOut(crossfadeDuration);
            currentClip.action.stop();

            nextClip.action.reset();
            nextClip.action.fadeIn(crossfadeDuration);
            nextClip.action.play();

            console.log('Current Animation Clip:', nextClip.action.getClip().name);

            return nextIndex;
          });
        };

        // Start the interval to play the next random animation
        intervalRef.current = setInterval(playNextRandomAnimation, randomClips[0].duration * 1000);

        // Play the first random animation
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




// import React, { useState, useEffect } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import PropTypes from 'prop-types';
// import * as THREE from 'three';

// function Model({ modelUrl, pos, rot, sca, pauseAnimation = true, animated, customAnimation }) {
//   const [gltf, setGltf] = useState();
//   const [mixer, setMixer] = useState(null);

//   useEffect(() => {
//     const loader = new GLTFLoader();
//     loader.load(modelUrl, (gltf) => {
//       setGltf(gltf);
//       if (gltf.animations.length > 0) {
//         const mixer = new THREE.AnimationMixer(gltf.scene);
//         setMixer(mixer);
//         const idleAnimation = gltf.animations.find((clip) => clip.name === 'idle');
//         if (idleAnimation) {
//           const idleAction = mixer.clipAction(idleAnimation);
//           idleAction.setLoop(THREE.LoopRepeat);
//           idleAction.play();
//         }
//       }
//     });
//   }, [modelUrl]);

//   useFrame((state, delta) => {
//     if (animated && mixer && !pauseAnimation) {
//       if (customAnimation) {
//         customAnimation.update(delta);
//       } else {
//         mixer.update(delta);
//       }
//     }
//   });

//   return gltf ? (
//     <group position={pos} rotation={rot} scale={sca}>
//       <primitive object={gltf.scene} />
//     </group>
//   ) : null;
// }

// Model.propTypes = {
//   modelUrl: PropTypes.string,
//   pos: PropTypes.any,
//   rot: PropTypes.any,
//   sca: PropTypes.any,
//   pauseAnimation: PropTypes.bool,
//   animated: PropTypes.bool,
//   customAnimation: PropTypes.object, // New prop for the custom animation
// };

// export default Model;
