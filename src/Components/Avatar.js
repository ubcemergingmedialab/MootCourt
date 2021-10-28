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
    const voices = window.speechSynthesis.getVoices()
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

function Avatar({ avatarPos, avatarRot, buttonOffset, modelUrl, voiceId }) {
    const [micStarted, startMic] = useState(false)
    const [blendShape, setBlendShape] = useState([0, 0, 0])  //blendshapes can be used for shaping mouth
    const { speak } = useSpeechSynthesis()
    const { textToSay } = useControls({ textToSay: "hello world" });
    const [voice, setVoice] = useState();
    const [voicesReady, setVoicesReady] = useState(false)
    const [animationPause, setAnimationPause] = useState(false)
    const updateVoice = (voiceUpdate) => {
        console.log("updating voices ", voiceUpdate);
        setVoice(voiceUpdate);
    }
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('voices ready');
        setVoicesReady(true);
    }
    useEffect(() => {
        if (window.speechSynthesis.getVoices().length > 0) {
            setVoicesReady(true)
        }
    }, [])
    return (<>
        <Suspense fallback={null}>
            <mesh rotation={avatarRot} position={avatarPos}>
                <Button clickHandler={() => /*!micStarted? startMic(true): null*/ speak({ text: textToSay, voice: voice })}
                    position={buttonOffset}
                    scale={[2 + blendShape[1] * 5, 2 + blendShape[0] * 5, 2 + blendShape[2] * 5]}
                    rotation={[0.2, 0.2, 0]}
                    buttonText={"Speak"} />
                <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setAnimationPause(!animationPause)}
                    position={buttonOffset.map((e, i) => {return i === 0? -e: e})}
                    scale={[2 + blendShape[1] * 5, 2 + blendShape[0] * 5, 2 + blendShape[2] * 5]}
                    rotation={[0.2, 0.2, 0]}
                    buttonText={"Pause Animation"} />
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