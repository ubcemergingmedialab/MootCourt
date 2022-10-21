import React, { Suspense, useEffect, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import { useControls } from 'leva'

const VoiceSelect = ({ updateVoice }) => {
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

//const deleteOldSkin = ({})

/**
 * A general purpose Avatar component that makes use of web speech synthesis and glb model loading (Model component). Parent can configure/play/puase animation and uses prop functions
 * to communicate speech synthesis ready, started speaking and finished speaking.
 */
function VoiceComponent({textToSay, utteranceRepeat, readyToSpeak, startedSpeaking, finishedSpeaking }) {
    const [micStarted, startMic] = useState(false)
    
    const onEnd = () => {
        finishedSpeaking()
    }
    const { speak, cancel } = useSpeechSynthesis({ onEnd })
    const [voice, setVoice] = useState(); // used to rerender avatar with a new voice based on user decision. Currently decided by leva, could add prop to decide this externally
    const [voicesReady, setVoicesReady] = useState(false) // causes rerender on voices loaded

    const updateVoice = (voiceUpdate) => {
        console.log("updating voices ", voiceUpdate);
        setVoice(voiceUpdate);
        finishedSpeaking();
        setVoicesReady(true)
    } // function to pass into VoiceSelect component

    window.speechSynthesis.onvoiceschanged = () => {
        console.log('voices ready');
        finishedSpeaking();
        setVoicesReady(true);
    } // even handler to rerender when speechSynthesis has loaded some voices

    useEffect(() => {
        console.log('speaking: ' + textToSay)
        cancel()
        speak({ text: textToSay, voice: voice, rate: 1.0 })
        startedSpeaking && textToSay !== "" && startedSpeaking()
    }, [textToSay]) // changes in textToSay will cause new utterance to start

    useEffect(() => {
        voicesReady && readyToSpeak()
    }, [voicesReady]) // let caller know it can start sending utterances to say

    useEffect(() => {
        cancel()
        speak({ text: textToSay, voice: voice, rate: 0.7 })
        startedSpeaking && textToSay !== "" && startedSpeaking()
    }, [utteranceRepeat])

    return (<>
        <Suspense fallback={null}>
            {voicesReady ? <VoiceSelect updateVoice={updateVoice} /> : null}
        </Suspense>
    </>
    )

}

export default VoiceComponent;