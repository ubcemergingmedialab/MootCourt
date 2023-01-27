import React, { Suspense, useEffect, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import { useControls } from 'leva'

// select optimal female voice for the judge by
// a) checking for OS
// b) selecting Linda for Windows and Samantha for Mac
// c) Google US English as fallback
const SelectOptimalVoice = ({ updateVoice }) => {
    const voices = window.speechSynthesis.getVoices();
    let defaultVoice = "Microsoft Linda - English (Canada)";
    let optimalVoice = {}
    let isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;

    console.log("is this mac? " + isMac);
    if (isMac){
        defaultVoice = "Samantha"
        }else{
        defaultVoice = "Microsoft Linda - English (Canada)"
        }
        
    if (voices[0].name !== defaultVoice){
        if (voices.some(item => item.name === defaultVoice)){
            for (let i = 0; i < voices.length; i++){
                if(voices[i].name === defaultVoice){
                    optimalVoice = voices[i]
                }
            }
        } else {
        for (let i = 0; i < voices.length; i++){
            if (voices[i].name === "Google US English"){
                optimalVoice = voices[i]
            }
        } 
    }
}
    useEffect(() => {
        updateVoice(optimalVoice)
    }, [optimalVoice]) 
    return null
}

// returns voice component of judge.
function VoiceComponent({textToSay, utteranceRepeat, readyToSpeak, startedSpeaking, finishedSpeaking, appPaused}) {
    const onEnd = () => {
        finishedSpeaking()
    }
    // call "speak" to start speech, "cancel" to pause speech
    const {speak, cancel} = useSpeechSynthesis({ onEnd })
    const [voice, setVoice] = useState<SpeechSynthesisVoice>()
    const [voicesReady, setVoicesReady] = useState<boolean>(false) // causes rerender on voices loaded

    // 1) check if voice is available on the browser.
    // If voices are available, signal "setvoicesready". SelectOptimalVoice will run.
    useEffect(() => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices.length > 0) {
            setVoice(availableVoices[0])
            finishedSpeaking()
            setVoicesReady(true)
        }
        window.speechSynthesis.onvoiceschanged = () => {
            setVoice(availableVoices[0])
            console.log('voices reset')
            console.log('voice:', voice)
            finishedSpeaking()
            setVoicesReady(true)
        }
    }, [])

    // 3) when the textToSay is updated, the previous speech (if it was happening) cancels and a new speech starts. 
    useEffect(() => {
        if (!appPaused) {
            console.log('speaking: ' + textToSay)
            cancel()
            speak({ text: textToSay, voice: voice, rate: 1.0 })
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
        }
    }, [appPaused])
        

    // 4) if the voice is updated by the user during the app usage, any ongoing speech will be cancelled and a new voice will be set.
    const updateVoice = (voiceUpdate) => {
        cancel()
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