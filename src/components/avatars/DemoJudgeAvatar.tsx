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


function DemoJudgeAvatar({animated = true, listOfUtterances}) {
    const [currentText, setText] = useState("initial text state")
    const [textIndex, setTextIndex] = useState(0)
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const utteranceListLength = listOfUtterances.length
    const [utterances, setUtterances] = useState(listOfUtterances)
    const [animationPaused, setAnimationPaused] = useState(true)
    const [skin, setSkin] = useState()
    const [skinState, setSkinState] = useState("")
    const [appellantSelection, setAppellantSelection] = useState(false)
    const [respondentSelection, setRespondentSelection] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)


    const updateSkin = (skinUpdate) => {
        console.log("updating judge skins ", skinUpdate)
        setSkin(skinUpdate);
        setSkinState("NewSkin");
    }

    useEffect(() => {
        const keyDownHandler = (e) => {
          console.log("pressed key: " + e.key)
          setText(utterances[e.key])
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

    return (<Suspense fallback={null}>
        <Avatar isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} appPaused={false} position={[0, -3, 2.5]} rotation={[0, 0, 0]} modelUrl={'models/judge_avatar/human_female.glb'} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
        {/* <Text
        position={[0, 1.3, 3]}
        scale={[1, 1, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
            1: Introduction to Moot Court
        </Text>
        <Text
        position={[0, 1.15, 3]}
        scale={[1, 1, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
            2: Today's Demo
        </Text>
        <Text
        position={[0, 1.0, 3]}
        scale={[1, 1, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
            3: Demo topic
        </Text>
        <Text
        position={[0, 0.85, 3]}
        scale={[1, 1, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
            4: Problems with the current policy
        </Text>
        <Text
        position={[0, 0.7, 3]}
        scale={[1, 1, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
            5: Policy specification
        </Text>
        <Text
        position={[0, 0.55, 3]}
        scale={[1, 1, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
            6: Choose your position
        </Text> */}
        {/* <SkinSelect updateSkin={updateSkin}></SkinSelect> */}
    </Suspense>)
}

export default DemoJudgeAvatar;