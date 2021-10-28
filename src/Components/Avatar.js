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

function Avatar({ position, rotation, buttonOffset, modelUrl, textToSay, readyToSpeak }) {
    const [micStarted, startMic] = useState(false) //call navigator.mediaDevices.getUserMedia or grab audio stream for lip syncing
    const [blendShape, setBlendShape] = useState([0, 0, 0])  //blendshapes can be used for shaping mouth, currently unused
    const { speak } = useSpeechSynthesis()
    const [voice, setVoice] = useState(); // used to rerender avatar with a new voice based on user decision. Currently decided by leva, could add prop to decide this externally
    const [voicesReady, setVoicesReady] = useState(false) // causes rerender on voices loaded
    const [animationPause, setAnimationPause] = useState(false) // allows button to control avatar animations
    const updateVoice = (voiceUpdate) => {
        console.log("updating voices ", voiceUpdate);
        setVoice(voiceUpdate);
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
        speak({text: textToSay, voice: voice})
    }, [textToSay]) // changes in textToSay will cause new utterance to start
    useEffect(() => {
        voicesReady && readyToSpeak()
    }, [voicesReady]) // let caller know it can start sending utterances to say
    return (<>
        <Suspense fallback={null}>
            <mesh rotation={rotation} position={position}>
                {buttonOffset? (<><Button clickHandler={() => {
                    window.speechSynthesis.cancel()
                    speak({ text: textToSay, voice: voice })
                }}
                    position={buttonOffset}
                    scale={[2 + blendShape[1] * 5, 2 + blendShape[0] * 5, 2 + blendShape[2] * 5]}
                    rotation={[0.2, 0.2, 0]}
                    buttonText={"Speak"} />
                <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setAnimationPause(!animationPause)}
                    position={buttonOffset.map((e, i) => {return i === 0? -e: e})}
                    scale={[2 + blendShape[1] * 5, 2 + blendShape[0] * 5, 2 + blendShape[2] * 5]}
                    rotation={[0.2, 0.2, 0]}
                    buttonText={"Pause Animation"} /></>) : null}
                <Model modelUrl={modelUrl}
                    pos={[0, 0, 0]}
                    rot={[0, 0, 0]}
                    sca={[2, 2, 2]}
                    startAnimation={true}
                    pauseAnimation={animationPause} ></Model>
                {micStarted ? <LipSync blendShapeHandler={(shapes) => setBlendShape([shapes.BlendShapeMouth, shapes.BlendShapeLips, shapes.BlendShapeKiss])} /> : null}
                {voicesReady ? <VoiceSelect updateVoice={updateVoice} /> : null}</mesh>
        </Suspense>
    </>
    )

}

export default Avatar;