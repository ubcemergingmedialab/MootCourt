import React, { Suspense, useEffect, useState } from 'react'
import ModelNPC from '../general/ModelNPC';

//Contols the animation component for AvatarNPC, plays the main animation that's with the model

function AnimationComponentNPC({appPaused, position, rotation, modelUrl, animated, animationPause}) {
   
    const [isAnimationPaused, setIsAnimationPaused] = useState(true)

    // Every time the value of appPaused is updated, make sure that the animation is paused if appstate is paused
    useEffect(() => {
        console.log("pausing animation (if it was playing earlier) since global app state is paused")
        setIsAnimationPaused(appPaused)
        // setIsAnimationPaused(!isSpeaking)
    }, [appPaused])

    return (<>
        <Suspense fallback={null}>
            <mesh rotation={rotation} position={position}>
                <ModelNPC modelUrl={modelUrl}
                    pos={[0, 0, 0]}
                    rot={[0, 0, 0]}
                    sca={[2, 2, 2]}
                    pauseAnimation={isAnimationPaused}
                    animated={animated}></ModelNPC>
                </mesh>
        </Suspense>
    </>
    )

}

export default AnimationComponentNPC;