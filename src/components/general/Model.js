import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import PropTypes from 'prop-types';
import * as THREE from 'three';

function Model({ modelUrl, pos, rot, sca, isSpeaking = true, pauseAnimation = true, animated }) {
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
      const crossfadeDuration = 0.3; // Adjust the crossfade duration as needed
      let interval;

      if (isSpeaking) {
        // If speaking is true, play the talking clip
        const speakingClip = animations.find((clip) => clip.action.getClip().name === 'talking');

        if (speakingClip) {
          setCurrentAnimationIndex(0);
          speakingClip.action.reset();

          speakingClip.action.fadeIn(crossfadeDuration);

          speakingClip.action.play();

          console.log('Current Animation Clips:', [ speakingClip.action.getClip().name]);

          interval = setInterval(() => {
            speakingClip.action.reset();

            speakingClip.action.fadeIn(crossfadeDuration);

            speakingClip.action.play();
          }, speakingClip.duration * 1000);
        }
      } else {
        // If speaking is false, play the random clips in a loop
        const randomClips = animations.filter((clip) => clip.action.getClip().name !== 'talking');

        setCurrentAnimationIndex(0);

        interval = setInterval(() => {
          setCurrentAnimationIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % randomClips.length;
            const currentClip = randomClips[nextIndex];

            const previousClip = randomClips[prevIndex];
            previousClip.action.fadeOut(crossfadeDuration);
            previousClip.action.stop();

            currentClip.action.reset();
            currentClip.action.fadeIn(crossfadeDuration);
            currentClip.action.play();

            console.log('Current Animation Clip:', currentClip.action.getClip().name);

            return nextIndex;
          });
        }, randomClips[0].duration * 1000);
      }

      return () => {
        clearInterval(interval);
        setCurrentAnimationIndex(0); // Reset current animation index
      };
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
