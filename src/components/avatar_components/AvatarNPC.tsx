import React, { Suspense, useEffect, useRef, useState } from 'react'
import AnimationComponentNPC from './AnimationComponentNPC';
/*
 * Avatar for non-speaking avatars (NPC)
 */
function Avatar_NPC({appPaused, position, rotation, modelUrl, animated, animationPause = true}) {


    return (<>
        <Suspense fallback={null}>
            <AnimationComponentNPC appPaused={appPaused} position={position} rotation={rotation} modelUrl={modelUrl} animated={animated} animationPause={animationPause}></AnimationComponentNPC>
        </Suspense>
    </>
    )

}

export default Avatar_NPC;