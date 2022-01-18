import { Suspense, useEffect, useState } from 'react'
import Avatar from './Avatar.js'
import Button from './Button.js'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'
import Subtitle from './Subtitle.js'
import QuestionSnooze from './QuestionSnooze.jsx'

const testlistOfUtterances = [[
    "Did not the trial court make some findings of fact contrary to your submissions, and should we not defer to those findings of fact?",
    "Should not we presume that the trial judge knows the law and applied the correct law?",
    "Are not some of the facts of the cases you rely upon much different from the facts of this case?",
    "Could you please tell the Court exactly where you are in your Factum at this point?",
],
[
    "What does the opposing counsel say about this submission, and why are they not correct?",
    "As you are aware, we are not bound by any precedents.  Could you please tell the Court why we should follow the law in the main authorities that you rely on?",
    "What are the policy implications of your submissions, and would they take the law in this area in a positive direction?  Are there not some risks of interpreting the law in this manner?",
    "What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?",
    "Were the errors you argue significant enough to justify the remedy you are seeking?  In other words, would the result at trial necessarily have been different if those errors did not occur?"
]]

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

function JudgeAvatar({ position, modelUrl, utteranceSplit, speaks, animated = true, listOfUtterances = testlistOfUtterances, appPaused }) {
    const [utteranceIndex, setUtteranceIndex] = useState(0)
    const [currentText, setText] = useState("")
    const [textIndex, setTextIndex] = useState(0)
    const [repeatingQuestion, setRepeatingQuestion] = useState(false)
    const [firstQuestion, setFirstQuestion] = useState(false)
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const [snoozeTimeLeft, setSnoozeTimeLeft] = useState(Number.MAX_SAFE_INTEGER)
    const utteranceListLength = listOfUtterances[utteranceIndex].length
    let questionInterval;

    const [skin, setSkin] = useState();

    const [skinState, setSkinState] = useState("");

    const updateSkin = (skinUpdate) => {
        console.log("updating judge skins ", skinUpdate);
        setSkin(skinUpdate);
        setSkinState("NewSkin");
    }
    const snoozeQuestionHandler = (snoozeMilliseconds) => {
        nextQuestionTime += snoozeMilliseconds
    }
    useEffect(() => {
        //File modelPath = new File("./models/");  //gets the model path for models
        //String modelList[] = modelpath.list();   //lists all model urls in the models folder

        //const fs = require('fs');
        // const modelList = fs.readdirSync('./models/');

        const modelList = ['human_female.glb', 'human_female_walking_default.glb', 'human_male.glb', 'human_male2.glb', 'testvid_default.glb'] //might be better to put this into a json file or db

        const avaliableSkins = modelList;
        if (avaliableSkins.length > 0) {
            setSkin(avaliableSkins[1])
        }

    }, [])

    useEffect(() => {
        if (readyToSpeak) {
            console.log('ready to speak')
            questionInterval = window.setInterval(() => {
                if (!appPaused) {
                    if (nextQuestionTime <= 0) {
                        console.log('utterance split again', utteranceSplit)
                        nextQuestionTime = (typeof utteranceSplit === "number" ? (utteranceSplit + Math.random() * 30000) : (180000 + Math.random() * 30000))
                        setTextIndex(prevTextIndex => (prevTextIndex + 1) % utteranceListLength)

                        console.log("speaking " + textIndex)
                    } else if (nextQuestionTime === Number.MAX_SAFE_INTEGER) {

                        console.log('utterance split first', utteranceSplit)
                        nextQuestionTime = (typeof utteranceSplit === "number" ? (utteranceSplit + Math.random() * 30000) : (180000 + Math.random() * 30000))
                        setFirstQuestion(true)
                        setText("")
                        setTextIndex(0)
                    } else {
                        nextQuestionTime -= 1000
                    }
                    setSnoozeTimeLeft(Math.floor(nextQuestionTime / 1000))
                    console.log(nextQuestionTime)
                }
            }, 1000)
        }
    }, [readyToSpeak])

    useEffect(() => {
        if (firstQuestion) {
            setText(listOfUtterances[utteranceIndex][textIndex])
        }
    }, [textIndex])
    const readyToSpeakHandler = () => { // start chain of utterances when avatar has loaded voices, passed down to prop in Avatar
        console.log('updating ready to speak')
        setReadyToSpeak(true)

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

    return (<><Suspense fallback={null}>
        {firstQuestion ? <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setRepeatingQuestion(!repeatingQuestion)}
            position={[position[0] - 1, position[1], position[2]]}
            rotation={[0.2, 0.2, 0]}
            buttonText={"Pause Animation"} /> : null}

        <Avatar id={Math.floor(Math.random() * 1000)} position={position} modelUrl={'models/judge_avatar/' + skin} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={repeatingQuestion} skinState={skinState} animated={animated}></Avatar>
        <Subtitle textToSay={currentText} />
        <SkinSelect updateSkin={updateSkin}></SkinSelect>
        {((snoozeTimeLeft <= 20) && (snoozeTimeLeft > 0)) ? <QuestionSnooze timeLeft={snoozeTimeLeft} position={position} snoozeQuestion={snoozeQuestionHandler}></QuestionSnooze> : null}
    </Suspense></>)
}

export default JudgeAvatar;