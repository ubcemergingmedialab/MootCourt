import React, { Suspense, useEffect, useState } from 'react'
import Model from '../general/Model'

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