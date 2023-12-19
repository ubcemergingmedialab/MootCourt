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
    const [isAnimationPaused, setIsAnimationPaused] = useState(true)

    useEffect(() => {
        setIsAnimationPaused(appPaused)
    }, [appPaused])

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