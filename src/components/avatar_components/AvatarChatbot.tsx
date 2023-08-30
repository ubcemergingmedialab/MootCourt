import React, { Suspense, useEffect, useRef, useState } from 'react'
import AnimationComponent from './AnimationComponent';
import Converse from '../general/Converse'

/*
 * A general purpose Avatar component that makes use of web speech synthesis and glb model loading (Model component). Parent can configure/play/puase animation and uses prop functions
 * to communicate speech synthesis ready, started speaking and finished speaking.
 */
function Avatar({config, updateConfig, isSpeaking, setIsSpeaking, appPaused, position, rotation, modelUrl, textToSay, utteranceRepeat, readyToSpeak, animated, animationPause = true, startedSpeaking, finishedSpeaking }) {

    return (<>
        <Suspense fallback={null}>
            <AnimationComponent isSpeaking={isSpeaking} appPaused={appPaused} position={position} rotation={rotation} modelUrl={modelUrl} animated={animated} animationPause={animationPause}></AnimationComponent>
            <Converse setIsSpeaking={setIsSpeaking} appPaused={appPaused} config={config} updateConfig={updateConfig}></Converse>
        </Suspense>
    </>
    )

}

export default Avatar;