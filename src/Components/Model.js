import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const AnimationSelect = ({ availableAnimations, updateAnimation }) => {
    const [{ animation }, set] = useControls(() => ({ animation: { options: availableAnimations } }))
    useEffect(() => {
        //updateAnimation(animation)
    }, [animation])
    return null
}

function Model({ modelUrl, pos, rot, sca, pauseAnimation = true, activeAnimation, animated }) {
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
                    //console.log('existing animation: ', clip.name, clip.duration, clip.tracks)
                    //animationObject[clip.name] = clip
                    action.play()
                    mixer.update(0.1)
                })
                //setAvailableAnimations(animationObject)
            }
            gltf.scene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                    child.material.side = THREE.FrontSide
                }
            })
        }, (xhr) => {

        }, (err) => {
            console.log('error happend loading model', modelUrl)
        });
    }, [modelUrl])

    const updateAnimation = (anim) => {
        setAnimationClip(anim)
    }

    useFrame((state, delta) => {
        if (animated) {
            if (!pauseAnimation && (typeof (pauseAnimation) !== "undefined")) {
                mixer?.update(delta)
            }
        }
    })

    /*(animated && gltf.animations.length > 0)?<AnimationSelect availableAnimations={availableAnimations} updateAnimation={updateAnimation}></AnimationSelect>:null*/
    return gltf ?
        (<group >
            <primitive
                position={pos}
                rotation={rot}
                scale={sca}
                object={gltf.scene}>

            </primitive>
        </group >)
        : null
}

export default Model;