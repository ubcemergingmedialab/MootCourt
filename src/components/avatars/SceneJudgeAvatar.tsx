import { Suspense, useEffect, useState, useRef } from 'react'
import Avatar from "../avatar_components/Avatar"
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import PropTypes from 'prop-types'
import { OrbitControls, Stats, Text } from "@react-three/drei";


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


function SceneJudgeAvatar({animated = true, judgeSpeechText, appPaused}) {
    const [currentText, setText] = useState("initial text state")
    const [readyToSpeak, setReadyToSpeak] = useState(false)
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

    // useEffect(() => {
    //     if (appPaused) {
    //         setAnimationPaused(false)
    //     }
    // }, [appPaused])

    return (<Suspense fallback={null}>
        <Avatar appPaused={appPaused} position={[0, -2.5, -3]} rotation={[0, 0, 0]} modelUrl={'models/judge_avatar/human_female.glb'} textToSay={judgeSpeechText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
    </Suspense>)
}

export default SceneJudgeAvatar;