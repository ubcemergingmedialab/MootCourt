import React, { Suspense, useEffect, useRef, useState } from 'react'
import AnimationComponentNPC from './AnimationComponentNPC';
/*
 * A general purpose Avatar component that makes use of web speech synthesis and glb model loading (Model component). Parent can configure/play/puase animation and uses prop functions
 * to communicate speech synthesis ready, started speaking and finished speaking.
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