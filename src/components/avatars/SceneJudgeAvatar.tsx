import { Suspense, useEffect, useState, useRef } from 'react'
import Avatar from "../avatar_components/Avatar"
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import PropTypes from 'prop-types'
import { OrbitControls, Stats, Text } from "@react-three/drei";
import AvatarStaticClassic from '../avatar_components/AvatarStaticClassic'


const SkinSelect = ({ updateSkin }) => {
    const modelList = ['human_female.glb', 'human_female_walking_default.glb', 'human_male.glb', 'human_male2.glb', 'testvid_default.glb']
    const judgeSkins = modelList;
    const judgeSkinObject = {}
    for (let i = 0; i < judgeSkins.length; i++) {
        judgeSkinObject[judgeSkins[i]] = judgeSkins[i];
    }
    const { judge } = useControls({ judge: { options: judgeSkinObject } })
    useEffect(() => {
        updateSkin(judge)
    }, [judge])
    return null
}


function SceneJudgeAvatar({animated = true, judgeSpeechText, appPaused, config}) {
    const [currentText, setText] = useState("initial text state")
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [animationPaused, setAnimationPaused] = useState(true)
    const [skin, setSkin] = useState()
    const [skinState, setSkinState] = useState("")


    const updateSkin = (skinUpdate) => {
        console.log("updating judge skins ", skinUpdate)
        setSkin(skinUpdate);
        setSkinState("NewSkin");
    }

    useEffect(() => {
        const keyDownHandler = (e) => {
            console.log("pressed key: " + e.key)
            setText("key was pressed. testing audio.")
        }
        document.addEventListener('keydown', keyDownHandler)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)

        }
    })

    useEffect(() => {
        if (readyToSpeak === true) {
            console.log('ready to speak')
        }
    }, [readyToSpeak])

    const readyToSpeakHandler = () => { // start chain of utterances when avatar has loaded voices, passed down to prop in Avatar
        console.log('updating ready to speak')
        setReadyToSpeak(true)
    }

    const startedSpeakingHandler = () => {
        setAnimationPaused(false)
    }

    const finishedSpeakingHandler = () => {
        setTimeout(() => {
            // setText("")
        }, 5000)
        setAnimationPaused(true)
    }

    useEffect(() => {
        if (appPaused) {
            setAnimationPaused(false)
        }
    }, [appPaused])

    if(config.isInteliJudge) {

        return (<Suspense fallback={null}>
            <Avatar isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} appPaused={appPaused} position={[0, -2.5, -3]} rotation={[0, 0, 0]} modelUrl={'models/judge_avatar/human_female.glb'} textToSay={judgeSpeechText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
        </Suspense>)

    } else {
        return (<Suspense fallback={null}>
            <AvatarStaticClassic isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} appPaused={appPaused} position={[0, -2.55, -3]} rotation={[0, 0, 0]} modelUrl={'models/judge_avatar/model_main_judge.glb'} textToSay={judgeSpeechText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></AvatarStaticClassic>
            <Avatar isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} appPaused={false} position={[2, -2.55, -3]} rotation={[0, 0, 0]} modelUrl={'models/judge_avatar/right_judge.glb'} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={true}finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
            <Avatar isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} appPaused={false} position={[-2, -2.55, -3]} rotation={[0, 0, 0]} modelUrl={'models/judge_avatar/left_judge.glb'} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={true}finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>

        </Suspense>)
    }

}

export default SceneJudgeAvatar;