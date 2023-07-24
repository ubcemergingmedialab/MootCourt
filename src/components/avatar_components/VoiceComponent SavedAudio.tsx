import React, { Suspense, useEffect, useState } from 'react'
// The method for speaking is different and uses audio from files <------
import {speak, cancel} from '../general/Play Audio'
import { useControls } from 'leva'


const SelectOptimalVoice = ({ updateVoice }) => {

    //Currently just sets it to defualts
    let optimalVoice = 'en-US_EmmaExpressive';

    useEffect(() => {
        updateVoice(optimalVoice)
    }, [optimalVoice]) 
    return null
}

// returns voice component of judge.
function VoiceComponent({setIsSpeaking, textToSay, utteranceRepeat, readyToSpeak, startedSpeaking, finishedSpeaking, appPaused}) {
    const onEnd = () => {
        setIsSpeaking(false)
        finishedSpeaking()
    }
    // call "speak" to start speech, "cancel" to pause speech
    const [voice, setVoice] = useState('en-US_EmmaExpressive')
    const [voicesReady, setVoicesReady] = useState<boolean>(false) // causes rerender on voices loaded

    // 1) check if voice is available on the browser.
    // If voices are available, signal "setvoicesready". SelectOptimalVoice will run.
    // TODO: this loads at each clock tick, refactor so it only triggers when needed


    // 3) when the textToSay is updated, the previous speech (if it was happening) cancels and a new speech starts. 
    useEffect(() => {
        if (!appPaused) {
            console.log('speaking: ' + textToSay)
            cancel()
            speak({ text: textToSay, voice: voice, rate: 1 }, onEnd)
            setIsSpeaking(true)
            startedSpeaking && textToSay !== "" && startedSpeaking()
        } else {
            console.log("global app state set as paused, speech input detected but not reading text")
        }
    }, [textToSay])

    // Does not guarantee that sound won't play when app is in pause state but new text is received. 
    // Above function uses boolean check to prevent this scenario
    useEffect(() => {
        if (appPaused) {
            cancel()
            setIsSpeaking(false)
        }
    }, [appPaused])
        

    // 4) if the voice is updated by the user during the app usage, any ongoing speech will be cancelled and a new voice will be set.
    const updateVoice = (voiceUpdate) => {
        cancel();
        console.log("updating voices ", voiceUpdate);
        setVoice(voiceUpdate);
        finishedSpeaking();
        setVoicesReady(true)
    }

    return (<>
        <Suspense fallback={null}>
            {/* 2) when the voice component is ready, the voice select will run and select the most optimal voice. */}
            {voicesReady ? <SelectOptimalVoice updateVoice={updateVoice} /> : null}
        </Suspense>
    </>
    )
}

export default VoiceComponent;