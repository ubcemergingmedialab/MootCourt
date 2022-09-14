import { Suspense, useEffect, useState } from 'react'
import Avatar from './Avatar.js'
import Button from './Button.js'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import Subtitle from './Subtitle.js'
import QuestionSnooze from './QuestionSnooze.jsx'
import PropTypes from 'prop-types'


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

let nextQuestionTime = Number.MAX_SAFE_INTEGER;

/**
 * A Component that uses Avatar speech sythesis and Subtitles to implement a simple agent that asks questions on a set time interval. Changes in Judge behaviour should be implemented here.
 */
function DemoJudgeAvatar({ position, modelUrl, utteranceSplit, speaks, animated = true, listOfUtterances, appPaused, snoozeEnabled, randomizeQuestions, subtitles, shouldWrapUp }) {
    const [currentText, setText] = useState("")
    const [textIndex, setTextIndex] = useState(0)
    const [repeatingQuestion, setRepeatingQuestion] = useState(false)
    const [firstQuestion, setFirstQuestion] = useState(false)
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const [snoozeTimeLeft, setSnoozeTimeLeft] = useState(Number.MAX_SAFE_INTEGER)
    const utteranceListLength = listOfUtterances.length
    const [utterances, setUtterances] = useState(listOfUtterances)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [previousTime, setPreviousTime] = useState(Date.now())
    const [questionTimeUpdate, setQuestionTimeUpdate] = useState(false)
    const [animationPaused, setAnimationPaused] = useState(true)
    let questionInterval

    const [skin, setSkin] = useState()
    const [skinState, setSkinState] = useState("")

    const updateSkin = (skinUpdate) => {
        console.log("updating judge skins ", skinUpdate)
        setSkin(skinUpdate);
        setSkinState("NewSkin");
    }
    const snoozeQuestionHandler = (snoozeMilliseconds) => {
        nextQuestionTime += snoozeMilliseconds
        setQuestionTimeUpdate(!questionTimeUpdate)
    }
    useEffect(() => {
        //File modelPath = new File("./models/");  //gets the model path for models
        //String modelList[] = modelpath.list();   //lists all model urls in the models folder

        //const fs = require('fs');
        // const modelList = fs.readdirSync('./models/');

        const modelList = ['human_female.glb', 'human_female_walking_default.glb', 'human_male.glb', 'human_male2.glb', 'testvid_default.glb'] //might be better to put this into a json file or db

        const avaliableSkins = modelList;
        if (avaliableSkins.length > 0) {
            setSkin(avaliableSkins[0])
        }

    }, [])

    useEffect(() => {
        //console.log('time effect')
        if (appPaused === false) {
            if (nextQuestionTime <= 0) {
                console.log('utterance split again', utteranceSplit)
                nextQuestionTime = utteranceSplit
                setFirstQuestion(true)
                setTextIndex(prevTextIndex => (prevTextIndex + 1) % utteranceListLength)
                // console.log("demojudgeavatar speaking: " + utterances[textIndex])
            } else if (nextQuestionTime === Number.MAX_SAFE_INTEGER) {
                console.log('utterance split first', utteranceSplit)
                nextQuestionTime = utteranceSplit
                setText("Welcome to Moot Court. Your demo will be starting shortly.")
                setTextIndex(-1)
            } else {
                nextQuestionTime -= elapsedTime
            }
            setSnoozeTimeLeft(Math.floor(nextQuestionTime / 1000))
        }
    }, [questionTimeUpdate, utterances])

    useEffect(() => {
        if (readyToSpeak === true && speaks === true) {
            console.log('ready to speak')
            questionInterval = window.setInterval(() => {setQuestionTimeUpdate(prevUpdate => !prevUpdate)}, 1000)
        }
    }, [readyToSpeak, speaks])

    // calculate elapsed time between each tick
    useEffect(() => {
        setElapsedTime(Date.now() - previousTime);
        setPreviousTime(Date.now());
    }, [questionTimeUpdate])

    useEffect(() => {
        if (firstQuestion) {
            setText(utterances[textIndex])
        }
    }, [textIndex])

    const readyToSpeakHandler = () => { // start chain of utterances when avatar has loaded voices, passed down to prop in Avatar
        console.log('updating ready to speak')
        setReadyToSpeak(true)

    }

    const startedSpeakingHandler = () => {
        setAnimationPaused(false)
    }

    const finishedSpeakingHandler = () => {
        setTimeout(() => {
            setText("")
        }, 10000)

        setAnimationPaused(true)
    }

    return (<Suspense fallback={null}>
        {firstQuestion ? <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setRepeatingQuestion(!repeatingQuestion)}
            position={[position[0] - 1, position[1], position[2]]}
            rotation={[0.2, 0.2, 0]}
            buttonText={"Pause Animation"} /> : null}
        <Avatar id={Math.floor(Math.random() * 1000)} position={position} modelUrl={'models/judge_avatar/' + skin} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={repeatingQuestion} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
        {/* {subtitles ? <Subtitle textToSay={currentText} /> : null} */}
        <SkinSelect updateSkin={updateSkin}></SkinSelect>
        {(snoozeEnabled && (snoozeTimeLeft <= 20) && (snoozeTimeLeft > 0)) ? <QuestionSnooze timeLeft={snoozeTimeLeft} position={position} snoozeQuestion={snoozeQuestionHandler}></QuestionSnooze> : null}
    </Suspense>)
}

DemoJudgeAvatar.propTypes = {
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