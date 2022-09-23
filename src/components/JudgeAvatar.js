import { Suspense, useEffect, useState } from 'react'
import Avatar from './Avatar.js'
import Button from './Button.js'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import Subtitle from './Subtitle.js'
import QuestionSnooze from './QuestionSnooze.jsx'
import PropTypes from 'prop-types'



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

    useEffect(() => {
        const modelList = ['human_female.glb', 'human_female_walking_default.glb', 'human_male.glb', 'human_male2.glb', 'testvid_default.glb'] //might be better to put this into a json file or db

        const avaliableSkins = modelList;
        if (avaliableSkins.length > 0) {
            setSkin(avaliableSkins[0])
        }

    }, [])

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
        <Avatar id={Math.floor(Math.random() * 1000)} position={position} modelUrl={'models/judge_avatar/' + skin} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={repeatingQuestion} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
        {subtitles ? <Subtitle textToSay={currentText} /> : null}
        <SkinSelect updateSkin={updateSkin}></SkinSelect>
    </Suspense>)
}

JudgeAvatar.propTypes = {
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

export default JudgeAvatar;