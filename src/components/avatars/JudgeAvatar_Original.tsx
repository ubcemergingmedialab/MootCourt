import { Suspense, useEffect, useState } from 'react'
import Avatar from '../avatar_components/Avatar'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import PropTypes from 'prop-types'
import Subtitle from './Subtitle'

const SkinSelect = ({ updateSkin }) => {
    //File modelPath = new File("./models/");  //gets the model path for models
    //String modelList[] = modelpath.list();   //lists all model urls in the models folder

    // const fs = require('fs');
    // const modelList = fs.readdirSync('./models/judge_avatar/'); // file names instead of file paths? (dynamically :())

    //manual implementatino of modellist -> brute force

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

let nextQuestionTime = Number.MAX_SAFE_INTEGER; // -1 means there is no question to be asked next. counts down until
const Appellant = 0
const Respondent = 1

/**
 * A Component that uses Avatar speech sythesis and Subtitles to implement a simple agent that asks questions on a set time interval. Changes in Judge behaviour should be implemented here.
 */
function JudgeAvatar({ position, modelUrl, utteranceSplit, speaks, animated = true, listOfUtterances, appPaused, snoozeEnabled, randomizeQuestions, subtitles, shouldWrapUp }) {
    const [currentText, setText] = useState("")
    const [repeatingQuestion, setRepeatingQuestion] = useState(false)
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const [snoozeTimeLeft, setSnoozeTimeLeft] = useState(Number.MAX_SAFE_INTEGER)
    const utteranceListLength = listOfUtterances.length
    const [utterances, setUtterances] = useState(listOfUtterances)
    const [animationPaused, setAnimationPaused] = useState(true)
    const [isSpeaking, setIsSpeaking] = useState(false)

    let questionInterval

    const [skin, setSkin] = useState()
    const [skinState, setSkinState] = useState("")

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

    const updateSkin = (skinUpdate) => {
        console.log("updating judge skins ", skinUpdate)
        setSkin(skinUpdate);
        setSkinState("NewSkin");
    }


    const readyToSpeakHandler = () => { // start chain of utterances when avatar has loaded voices, passed down to prop in Avatar
        console.log('updating ready to speak')
        setReadyToSpeak(true)

    }

    const startedSpeakingHandler = () => {
        setAnimationPaused(false)
    }

    const finishedSpeakingHandler = () => {
        setAnimationPaused(true)
    }

    return (<Suspense fallback={null}>
        <Avatar
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
            appPaused={false}
            position={position}
            modelUrl={'models/judge_avatar/' + skin}
            rotation={[0, 0, 0]}
            textToSay={currentText}
            readyToSpeak={readyToSpeakHandler}
            utteranceRepeat={repeatingQuestion}
            animated={animated}
            animationPause={animationPaused}
            finishedSpeaking={finishedSpeakingHandler}
            startedSpeaking={startedSpeakingHandler}></Avatar>
        {subtitles ? <Subtitle textToSay={currentText} /> : null}
        <SkinSelect updateSkin={updateSkin}></SkinSelect>
    </Suspense>)
}

export default JudgeAvatar;