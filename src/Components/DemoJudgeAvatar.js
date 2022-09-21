import { Suspense, useEffect, useState, useRef } from 'react'
import Avatar from './Avatar.js'
import Button from './Button.js'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import Subtitle from './Subtitle.js'
import QuestionSnooze from './QuestionSnooze.jsx'
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

/**
 * A Component that uses Avatar speech sythesis and Subtitles to implement a simple agent that asks questions on a set time interval. Changes in Judge behaviour should be implemented here.
 */
function DemoJudgeAvatar({ presentationPage, position, modelUrl, utteranceSplit, speaks, animated = true, listOfUtterances, appPaused, snoozeEnabled, randomizeQuestions, subtitles, shouldWrapUp }) {
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
        const modelList = ['human_female.glb', 'human_female_walking_default.glb', 'human_male.glb', 'human_male2.glb', 'testvid_default.glb'] //might be better to put this into a json file or db

        const avaliableSkins = modelList;
        if (avaliableSkins.length > 0) {
            setSkin(avaliableSkins[0])
        }
    }, [])

    useEffect(() => {
        if (readyToSpeak === true && speaks === true) {
            console.log('ready to speak')
        }
    }, [readyToSpeak, speaks])

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
        <Avatar id={Math.floor(Math.random() * 1000)} position={position} modelUrl={'models/judge_avatar/' + skin} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
        {/* {subtitles ? <Subtitle textToSay={currentText} /> : null} */}
        <Text
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
        </Text>
        <SkinSelect updateSkin={updateSkin}></SkinSelect>
    </Suspense>)
}

DemoJudgeAvatar.propTypes = {
    presentationPage: PropTypes.func,
    /** vector3 describing position of judge, passed to Avatar component */
    position: PropTypes.any,
    /** url for the model that should be loaded, passed to Avatar component */
    modelUrl: PropTypes.string,
    /** how long judge will wait between questions */
    utteranceSplit: PropTypes.number,
    /** whether or not this judge will make use of speech synthesis. */
    speaks: PropTypes.bool,
    /** Wheter or not this judge will use animations in the Model, passed to Avatar component*/
    animated: PropTypes.bool,
    /** The list of questions the judge will draw on */
    listOfUtterances: PropTypes.arrayOf(PropTypes.string),
    /** Judge will react to this boolean by pausing its counting of time till next question */
    appPaused: PropTypes.bool,
    /** Whether or not the SnoozeQuestions UI will show */
    snoozeEnabled: PropTypes.bool,
    /** if true, questions will be shuffle before presentation starts */
    randomizeQuestions: PropTypes.bool,
    /** if true, captions will be shown */
    subtitles: PropTypes.bool,
    /** Judge will react to true by asking participant to finish */
    shouldWrapUp: PropTypes.bool
}

export default DemoJudgeAvatar;