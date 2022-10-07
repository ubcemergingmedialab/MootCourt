import React, { Suspense, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { useSpeechSynthesis } from 'react-speech-kit';
import { Box, Stage } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import PropTypes from 'prop-types';
import Model from '../general/Model'
import propTypes from 'prop-types';

const voiceId = Math.random();

const VoiceSelect = ({ updateVoice }) => {
    const voices = window.speechSynthesis.getVoices();
    const voiceObject = {}
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
function Avatar({ position, rotation, modelUrl, textToSay, utteranceRepeat, readyToSpeak, animated, animationPause = true, startedSpeaking, finishedSpeaking }) {
    const [micStarted, startMic] = useState(false)
    const [blendShape, setBlendShape] = useState([0, 0, 0])  //blendshapes can be used for shaping mouth, currently unused

    const onEnd = () => {
        finishedSpeaking()
    }
    const { speak, cancel } = useSpeechSynthesis({ onEnd })
    const [voice, setVoice] = useState(); // used to rerender avatar with a new voice based on user decision. Currently decided by leva, could add prop to decide this externally
    const [voicesReady, setVoicesReady] = useState(false) // causes rerender on voices loaded
    //const [skinState, setSkinState] = useState("modelUrl"); //identifies the skin as original (in no replacement is needed or new in which old model must be deleted)
    const [isAnimationPaused, setIsAnimationPaused] = useState(true)

    useEffect(() => {
        setIsAnimationPaused(animationPause)
    }, [animationPause])
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
        } // even handler to rerender when speechSynthesis has loaded some voices
    }, []) // voices might have been loaded before component mounts, in which case event will never fire

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
            <mesh rotation={rotation} position={position}>
                <Model modelUrl={modelUrl}
                    pos={[0, 0, 0]}
                    rot={[0, 0, 0]}
                    sca={[2, 2, 2]}
                    pauseAnimation={isAnimationPaused}
                    animated={animated}></Model>
                {voicesReady ? <VoiceSelect updateVoice={updateVoice} /> : null}</mesh>
        </Suspense>
    </>
    )

}


Avatar.propTypes = {
     /** used to set the position of the Avatar in 3d space*/
    position: PropTypes.any,
     /** used to set the rotation of the Avatar in 3d space*/
    rotation: PropTypes.any,
    /** url passed to Model component*/
    modelUrl: PropTypes.string,
    /** used to control Avatar speech synthesis*/
    textToSay: PropTypes.string,
    /** used to control Avatar speech synthesis, causes repeat of current textToSay*/
    utteranceRepeat: PropTypes.bool,
    /** used to message parent that speech synthesis is ready*/
    readyToSpeak: PropTypes.func,
    /** configures animations in Model component*/
    animated: PropTypes.bool,
    /** pauses/unpauses animations in Model component*/
    animationPause: PropTypes.bool,
    /** used to message parent that speech synthesis has started an utterance*/
    startedSpeaking: PropTypes.func,
    /** used to message parent that speech synthesis has finished an utterance*/
    finishedSpeaking: PropTypes.func
}

export default Avatar;