import React, { Suspense, useEffect, useRef, useState } from 'react'
import AnimationComponent from './AnimationComponent';
import VoiceComponent from './VoiceComponent SavedAudio';

/*
 * This Avatar uses saved audio to play back questions
 * Used for Classic version
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