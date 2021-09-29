import React, { useState, useEffect } from 'react'
import { Group } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Model({ modelUrl, pos, rot }) {
    const [gltf, setGltf] = useState();

    useEffect(() => {
        new GLTFLoader().load(modelUrl, (gltf) => {
            setGltf(gltf);
        });
    }, [modelUrl])
    return gltf ?
        (<group>
            <primitive

                position={pos}
                rotation={rot}
                object={gltf.scene}>

            </primitive>
        </group >)
        : null
}

export default Model;