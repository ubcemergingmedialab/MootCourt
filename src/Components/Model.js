import React, { useState, useEffect, useRef } from 'react'
import { Group } from 'three'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Model({ modelUrl, pos, rot, sca, startAnimation, pauseAnimation }) {
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
                    action.play()
                })
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