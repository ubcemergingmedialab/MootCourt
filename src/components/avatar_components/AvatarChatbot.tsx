import React, { Suspense, useEffect, useRef, useState } from 'react'
import AnimationComponent from './AnimationComponent';
import AudioComponent from './AudioComponent'
import ConverseComponent from '../general/Converse'

/*
 * A general purpose Avatar component that makes use of web speech synthesis and glb model loading (Model component). Parent can configure/play/puase animation and uses prop functions
 * to communicate speech synthesis ready, started speaking and finished speaking.
 */
function Avatar({config, updateConfig, isSpeaking, setIsSpeaking, appPaused, position, rotation, modelUrl, textToSay, utteranceRepeat, readyToSpeak, animated, animationPause, startedSpeaking, finishedSpeaking }) {
    const [transcript, setTranscript] = useState('');
    const handleTranscriptChange = (newTranscript) => {
        setTranscript(newTranscript);
    };

    return (<>
        <Suspense fallback={null}>
            <AnimationComponent
                isSpeaking={isSpeaking}
                appPaused={appPaused}
                position={position}
                rotation={rotation}
                modelUrl={modelUrl}
                animated={animated}
                animationPause={animationPause}/>
            <AudioComponent
                appPaused={appPaused}
                onTranscriptChange={handleTranscriptChange}/>
            <ConverseComponent
                setIsSpeaking={setIsSpeaking}
                appPaused={appPaused}
                config={config}
                updateConfig={updateConfig}
                userSpeechToTextInput={transcript}/>
        </Suspense>
    </>
    )

}

export default Avatar;