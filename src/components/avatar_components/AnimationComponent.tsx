import React, { Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Box, Stage } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import PropTypes from 'prop-types';
import Model from '../general/Model'
import propTypes from 'prop-types';


function AnimationComponent({position, rotation, modelUrl, animated, animationPause = true}) {
    const [blendShape, setBlendShape] = useState([0, 0, 0])  //blendshapes can be used for shaping mouth, currently unused
    //const [skinState, setSkinState] = useState("modelUrl"); //identifies the skin as original (in no replacement is needed or new in which old model must be deleted)
    const [isAnimationPaused, setIsAnimationPaused] = useState(true)

    useEffect(() => {
        setIsAnimationPaused(animationPause)
    }, [animationPause])
    
    return (<>
        <Suspense fallback={null}>
            <mesh rotation={rotation} position={position}>
                <Model modelUrl={modelUrl}
                    pos={[0, 0, 0]}
                    rot={[0, 0, 0]}
                    sca={[2, 2, 2]}
                    pauseAnimation={isAnimationPaused}
                    animated={animated}></Model>
                </mesh>
        </Suspense>
    </>
    )

}

export default AnimationComponent;