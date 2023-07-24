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

  //Controls the animations clips that should be playing
  useEffect(() => {
    if (animations.length > 0) {
      const crossfadeinDuration = 1;
      const crossfadeoutDuration = 2;
      const speakingClip = animations.find((clip) => clip.action.getClip().name === 'talking');

      //When the judge is speaking, the 'talking' animation will play by fading in, when it's not the talking will fade out (intensity will go down)
      //Note: the talking animation will always be playing, the intensity will change depending when it should be speaking 
      if (isSpeaking) {
        if (speakingClip) {
          setCurrentAnimationIndex(0);
          speakingClip.action.setLoop(THREE.LoopRepeat);
          speakingClip.action.reset();
          speakingClip.action.fadeIn(crossfadeinDuration);
          speakingClip.action.play();
          console.log('Current Animation Clips:', [speakingClip.action.getClip().name]);
        }
      } else {
        // speakingClip.action.fadeOut(crossfadeoutDuration);

        speakingClip.action.fadeOut(crossfadeoutDuration, () => {
          // Stop the currentClip once its fade-out is complete
          speakingClip.action.stop();
        });

        const randomClips = animations.filter(
          (clip) => clip.action.getClip().name !== 'talking');

        setCurrentAnimationIndex(0);

        // Helper function to play the next random animation
        const playNextRandomAnimation = () => {
          setCurrentAnimationIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % randomClips.length;
            const currentClip = randomClips[prevIndex];
            const nextClip = randomClips[nextIndex];

            currentClip.action.fadeOut(crossfadeoutDuration, () => {
              // Stop the currentClip once its fade-out is complete
              currentClip.action.stop();
            });
            nextClip.action.reset();
            nextClip.action.setLoop(THREE.LoopOnce)
            nextClip.action.fadeIn(crossfadeinDuration);
            nextClip.action.play();

            console.log('Current Animation Clip:', nextClip.action.getClip().name);

            return nextIndex;
          });
        };

        // Start the interval to play the next random animation
        intervalRef.current = setInterval(playNextRandomAnimation, randomClips[0].duration * 1000);

        // Play the first random animation
        randomClips[0].action.fadeIn(crossfadeinDuration);
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
