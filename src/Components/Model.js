import React, { useState, useEffect, useRef } from 'react'
import { Group } from 'three'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Model({ modelUrl, pos, rot, sca, startAnimation, pauseAnimation, activeAnimation }) {
    const [gltf, setGltf] = useState();
    const [mixer, setMixer] = useState(null);
    useEffect(() => {
        new GLTFLoader().load(modelUrl, (gltf) => {
            setGltf(gltf);
            if(gltf.animations.length > 0) {
                let mixer = new THREE.AnimationMixer(gltf.scene)
                setMixer(mixer)
                
                gltf.animations.forEach(clip => {
                    const action = mixer.clipAction(clip)
                    //action.play()
                    //console.log('existing animation: ', action.name, action.duration, action.tracks)
                })
                console.log(gltf.animations)
            }
            gltf.scene.traverse(child => {
                if(child.isMesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                    child.material.side = THREE.FrontSide
                }
            })
        });
    }, [modelUrl])

    useEffect(()=> {
        if(mixer && activeAnimation && mixer.existingAction(activeAnimation)) {
            let action = mixer.clipAction(activeAnimation)
            action.play()
        }
    },[mixer, activeAnimation])

    useFrame((state, delta) => {
        if(startAnimation) {
            if(!pauseAnimation) {
                mixer?.update(delta)
            }
        }
    })
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