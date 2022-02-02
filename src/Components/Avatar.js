import React, { Suspense, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { useSpeechSynthesis } from 'react-speech-kit';
import {
    VRCanvas,
    useXREvent,
    Hands,
    Select,
    Hover,
    useXR,
    Interactive,
    RayGrab,
    useHitTest,
    ARCanvas,
    DefaultXRControllers,
} from '@react-three/xr'
import { Box, Stage } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useHover } from 'react-use-gesture'
import * as THREE from 'three'
import { useControls } from 'leva'
import '../styles.css'

import Button from './Button.js'
import Model from './Model.js'
import LipSync from './LipSync.js'

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

function Avatar({ position, rotation, buttonOffset, modelUrl, textToSay, utteranceRepeat, readyToSpeak, skinState, animated = true, animationPause = false, startedSpeaking, finishedSpeaking }) {
    const [micStarted, startMic] = useState(false) //call navigator.mediaDevices.getUserMedia or grab audio stream for lip syncing
    const [blendShape, setBlendShape] = useState([0, 0, 0])  //blendshapes can be used for shaping mouth, currently unused

    const onEnd = () => {
        finishedSpeaking()
    }
    const { speak, cancel } = useSpeechSynthesis({ onEnd })
    const [voice, setVoice] = useState(); // used to rerender avatar with a new voice based on user decision. Currently decided by leva, could add prop to decide this externally
    const [voicesReady, setVoicesReady] = useState(false) // causes rerender on voices loaded
    //const [skinState, setSkinState] = useState("modelUrl"); //identifies the skin as original (in no replacement is needed or new in which old model must be deleted)


    const updateSkin = (deleteOldSkin) => {
        if (skinState != "") {
            this.Model.dispose();
            skinState = modelUrl;
        }
    }
    const updateVoice = (voiceUpdate) => {
        console.log("updating voices ", voiceUpdate);
        setVoice(voiceUpdate);
        setVoicesReady(true)
    } // function to pass into VoiceSelect component
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('voices ready');
        setVoicesReady(true);
    } // even handler to rerender when speechSynthesis has loaded some voices
    useEffect(() => {
        const availableVoices = window.speechSynthesis.getVoices()
        if (availableVoices.length > 0) {
            setVoice(availableVoices[0])
            setVoicesReady(true)
        }
        window.speechSynthesis.onvoiceschanged = () => {
            setVoice(availableVoices[0])
            console.log('voices ready');
            setVoicesReady(true);
        } // even handler to rerender when speechSynthesis has loaded some voices
    }, []) // voices might have been loaded before component mounts, in which case event will never fire

    useEffect(() => {
        console.log('speaking')
        cancel()
        speak({ text: textToSay, voice: voice, rate: 0.7 })
        startedSpeaking && startedSpeaking()
    }, [textToSay]) // changes in textToSay will cause new utterance to start
    useEffect(() => {
        voicesReady && readyToSpeak()
    }, [voicesReady]) // let caller know it can start sending utterances to say
    useEffect(() => {
        cancel()
        speak({ text: textToSay, voice: voice, rate: 0.7 })
        startedSpeaking && startedSpeaking()
    }, [utteranceRepeat])
    return (<>
        <Suspense fallback={null}>
            <mesh rotation={rotation} position={position}>
                <Model modelUrl={modelUrl}
                    pos={[0, 0, 0]}
                    rot={[0, 0, 0]}
                    sca={[2, 2, 2]}
                    startAnimation={animated}
                    pauseAnimation={animationPause}
                    animated={animated}></Model>
                {micStarted ? <LipSync blendShapeHandler={(shapes) => setBlendShape([shapes.BlendShapeMouth, shapes.BlendShapeLips, shapes.BlendShapeKiss])} /> : null}
                {voicesReady ? <VoiceSelect updateVoice={updateVoice} /> : null}</mesh>
        </Suspense>
    </>
    )

}

export default Avatar;