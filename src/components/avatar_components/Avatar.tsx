import React, { Suspense, useEffect, useRef, useState } from 'react'
import AnimationComponent from './AnimationComponent';
//import VoiceComponent from './VoiceComponent';
import VoiceComponent from './VoiceComponent API';

/*
 * A general purpose Avatar component that makes use of web speech synthesis and glb model loading (Model component). Parent can configure/play/puase animation and uses prop functions
 * to communicate speech synthesis ready, started speaking and finished speaking.
 */
function Avatar({isSpeaking, setIsSpeaking, appPaused, position, rotation, modelUrl, textToSay, utteranceRepeat, readyToSpeak, animated, animationPause = true, startedSpeaking, finishedSpeaking }) {

    return (<>
        <Suspense fallback={null}>
            <AnimationComponent isSpeaking={isSpeaking} appPaused={appPaused} position={position} rotation={rotation} modelUrl={modelUrl} animated={animated} animationPause={animationPause}></AnimationComponent>
            <VoiceComponent setIsSpeaking={setIsSpeaking} appPaused={appPaused} textToSay={textToSay} utteranceRepeat={utteranceRepeat} readyToSpeak={readyToSpeak} startedSpeaking={startedSpeaking} finishedSpeaking={finishedSpeaking}></VoiceComponent>
        </Suspense>
    </>
    )

}

export default Avatar;