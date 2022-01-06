import React, { useState, useEffect, useRef } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const AnimationSelect = ({ availableAnimations, updateAnimation }) => {
    const [{ animation }, set] = useControls(() => ({ animation: { options: availableAnimations } }))
    useEffect(() => {
        updateAnimation(animation)
    }, [animation])
    return null
}

function Model({ modelUrl, pos, rot, sca, startAnimation, pauseAnimation, activeAnimation, animated }) {
    const [gltf, setGltf] = useState();
    const [mixer, setMixer] = useState(null);
    const [animationClip, setAnimationClip] = useState(activeAnimation ? activeAnimation : "")
    const [availableAnimations, setAvailableAnimations] = useState({})
    useEffect(() => {
        new GLTFLoader().load(modelUrl, (gltf) => {
            setGltf(gltf);
            if (gltf.animations.length > 0) {
                let mixer = new THREE.AnimationMixer(gltf.scene)
                setMixer(mixer)
                let animationObject = {}
                gltf.animations.forEach(clip => {
                    const action = mixer.clipAction(clip)
                    action.play()
                    console.log('existing animation: ', clip.name, clip.duration, clip.tracks)
                    animationObject[clip.name] = clip
                })
                setAvailableAnimations(animationObject)
            }
            gltf.scene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                    child.material.side = THREE.FrontSide
                }
            })
        });
    }, [modelUrl])

    const updateAnimation = (anim) => {
        setAnimationClip(anim)
    }

    useEffect(() => {
        if (mixer && activeAnimation && mixer.existingAction(activeAnimation)) {
            let action = mixer.clipAction(activeAnimation)
            action.play()
        }
    }, [mixer, animationClip])

    useFrame((state, delta) => {
        if (startAnimation) {
            if (!pauseAnimation) {
                mixer?.update(delta)
            }
        }
    })
    return gltf ?
        (<>{(animated && gltf.animations.length > 0)?<AnimationSelect availableAnimations={availableAnimations} updateAnimation={updateAnimation}></AnimationSelect>:null}<group >
            <primitive
                position={pos}
                rotation={rot}
                scale={sca}
                object={gltf.scene}>

            </primitive>
        </group ></>)
        : null
}

export default Model;