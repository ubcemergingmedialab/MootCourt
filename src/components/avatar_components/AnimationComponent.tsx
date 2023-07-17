import React, { Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Box, Stage } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import PropTypes from 'prop-types';
import Model from '../general/Model'
import propTypes from 'prop-types';


function AnimationComponent({isSpeaking, appPaused, position, rotation, modelUrl, animated, animationPause}) {
    const [blendShape, setBlendShape] = useState([0, 0, 0])  //blendshapes can be used for shaping mouth, currently unused
    //const [skinState, setSkinState] = useState("modelUrl"); //identifies the skin as original (in no replacement is needed or new in which old model must be deleted)
    const [isAnimationPaused, setIsAnimationPaused] = useState(true)

    // useEffect(() => {
    //     if (isSpeaking) {
    //         setIsAnimationPaused(false)
    //     } else {
    //         setIsAnimationPaused(true)
    //     }
    // }, [isSpeaking])

    // Every time the value of appPaused is updated, make sure that the animation is paused if appstate is paused
    useEffect(() => {
        console.log("pausing animation (if it was playing earlier) since global app state is paused")
        setIsAnimationPaused(appPaused)
        // setIsAnimationPaused(!isSpeaking)
    }, [appPaused])

    // useEffect(() => {
    //     if (!isSpeaking) {
    //         console.log("not speaking")
    //     }
    //     else (
    //         console.log("speaking")
    //     )
    // })
    
    return (<>
        <Suspense fallback={null}>
            <mesh rotation={rotation} position={position}>
                <Model modelUrl={modelUrl}
                    pos={[0, 0, 0]}
                    rot={[0, 0, 0]}
                    sca={[2, 2, 2]}
                    isSpeaking={isSpeaking}
                    pauseAnimation={isAnimationPaused}
                    animated={animated}></Model>
                </mesh>
        </Suspense>
    </>
    )

}

export default AnimationComponent;