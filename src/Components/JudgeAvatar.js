import { Suspense, useEffect, useState } from 'react'
import Avatar from './Avatar.js'
import Button from './Button.js'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import Subtitle from './Subtitle.js'
import QuestionSnooze from './QuestionSnooze.jsx'



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

function JudgeAvatar({ position, modelUrl, utteranceSplit, speaks, animated = true, listOfUtterances, appPaused, snoozeEnabled, randomizeQuestions, subtitles}) {
    const [currentText, setText] = useState("")
    const [textIndex, setTextIndex] = useState(-1)
    const [repeatingQuestion, setRepeatingQuestion] = useState(false)
    const [firstQuestion, setFirstQuestion] = useState(false)
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const [snoozeTimeLeft, setSnoozeTimeLeft] = useState(Number.MAX_SAFE_INTEGER)
    const utteranceListLength = listOfUtterances.length
    const [utterances, setUtterances] = useState(randomizeQuestions ? listOfUtterances.sort(() => (Math.random() > .5) ? 1 : -1) : listOfUtterances)
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
                nextQuestionTime = (typeof utteranceSplit === "number" ? (utteranceSplit + Math.random() * 30000) : (180000 + Math.random() * 30000))
                setFirstQuestion(true)
                setTextIndex(prevTextIndex => (prevTextIndex + 1) % utteranceListLength)
                console.log("speaking " + textIndex)
            } else if (nextQuestionTime === Number.MAX_SAFE_INTEGER) {
                console.log('utterance split first', utteranceSplit)
                nextQuestionTime = (typeof utteranceSplit === "number" ? (utteranceSplit + Math.random() * 30000) : (180000 + Math.random() * 30000))
                setText("")
                setTextIndex(-1)
            } else {
                nextQuestionTime -= 1000
            }
            setSnoozeTimeLeft(Math.floor(nextQuestionTime / 1000))
            console.log(nextQuestionTime)
        }
    }, [questionTimeUpdate, appPaused, utterances])

    useEffect(() => {
        console.log('judge is set to ', speaks, readyToSpeak)
        if (readyToSpeak === true && speaks === true) {
            console.log('ready to speak')
            questionInterval = window.setInterval(() => {
                setQuestionTimeUpdate(prevUpdate => !prevUpdate)
            }, 1000)
        }
    }, [readyToSpeak, speaks])

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

    }

    const finishedSpeakingHandler = () => {
        setTimeout(() => {
            setText("")
        }, 10000)
    }
    /*
    useEffect(() => { // when the utterance changes, start wait for the next one
        waitingInterval = setTimeout(() => {
            setFirstQuestion(true)
            setTextIndex((textIndex + 1) % utteranceListLength)
        }, utteranceSplit ? utteranceSplit + Math.random() * 30000 : 180000 + Math.random() * 30000)
    }, [currentText])
    useEffect(() => { // when utterance index changes, immediately start corresponding utterance
        console.log("text index effect " + textIndex)
        setText(listOfUtterances[utteranceIndex][textIndex])
    }, [textIndex])*/

    return (<Suspense fallback={null}>
        {firstQuestion ? <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setRepeatingQuestion(!repeatingQuestion)}
            position={[position[0] - 1, position[1], position[2]]}
            rotation={[0.2, 0.2, 0]}
            buttonText={"Pause Animation"} /> : null}

        <Avatar id={Math.floor(Math.random() * 1000)} position={position} modelUrl={'models/judge_avatar/' + skin} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={repeatingQuestion} skinState={skinState} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
        {subtitles? <Subtitle textToSay={currentText} /> : null}
        <SkinSelect updateSkin={updateSkin}></SkinSelect>
        {(snoozeEnabled && (snoozeTimeLeft <= 20) && (snoozeTimeLeft > 0)) ? <QuestionSnooze timeLeft={snoozeTimeLeft} position={position} snoozeQuestion={snoozeQuestionHandler}></QuestionSnooze> : null}
    </Suspense>)
}

export default JudgeAvatar;