import React, { Suspense, useEffect, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import { useControls } from 'leva'

const SelectOptimalVoice = ({ updateVoice }) => {
    const voices = window.speechSynthesis.getVoices();
    const voiceObject = {}
    let defaultVoice = "Microsoft Linda - English (Canada)";

    let isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;

    console.log("is this mac? " + isMac);

    if (isMac){
        defaultVoice = "Samantha"
        }else{
        defaultVoice = "Microsoft Linda - English (Canada)"
        }
    
    console.log("Testing SpeechSynthesis");
    
    if (voices[0].name !== defaultVoice){
        if (voices.some(item => item.name === defaultVoice)){
            for (let i = 0; i < voices.length; i++){
                if(voices[i].name === defaultVoice){
                    let tmp = voices[0];
                    voices[0] = voices[i];
                    voices[i] = tmp;
                }
            }
        } else {
        for (let i = 0; i < voices.length; i++){
            if (voices[i].name === "Google US English"){
                let tmp = voices[0];
                voices[0] = voices[i];
                voices[i] = tmp;
            }
        } 
        
    }
}
    for (let i = 0; i < voices.length; i++) {
        voiceObject[voices[i].name] = voices[i];
    }
    const { voice } = useControls({ voice: { options: voiceObject } })
    useEffect(() => {
        updateVoice(voice)
    }, [voice]) 
    return null
}

function VoiceComponent({textToSay, utteranceRepeat, readyToSpeak, startedSpeaking, finishedSpeaking }) {
    const onEnd = () => {
        finishedSpeaking()
    }
    // call "speak" to start speech, "cancel" to pause speech
    const {speak, cancel} = useSpeechSynthesis({ onEnd })
    const [voice, setVoice] = useState<SpeechSynthesisVoice>();
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
            console.log('voices ready')
            finishedSpeaking()
            setVoicesReady(true)
        }
    }, [])

    // 3) when the textToSay is updated, the previous speech (if it was happening) cancels and a new speech starts. 
    useEffect(() => {
        console.log('speaking: ' + textToSay)
        cancel()
        speak({ text: textToSay, voice: voice, rate: 1.0 })
        startedSpeaking && textToSay !== "" && startedSpeaking()
    }, [textToSay])
        

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