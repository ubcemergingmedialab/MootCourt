import { useEffect, useState } from 'react'
import Avatar from './Avatar.js'
import Button from './Button.js'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'

const listOfUtterances = [[
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

    const modelList = ['human_female.glb', 'human_male.glb', 'human_male2.glb', 'testvid_default.glb']

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

let nextQuestionTime = -1; // -1 means there is no question to be asked next. counts down until

function JudgeAvatar({ position, modelUrl, utteranceSplit, speaks = false, animated = true }) {
    const [utteranceIndex, setUtteranceIndex] = useState(0)
    const [currentText, setText] = useState(listOfUtterances[0][0])
    const [textIndex, setTextIndex] = useState(0)
    const [repeatingQuestion, setRepeatingQuestion] = useState(false)
    const [firstQuestion, setFirstQuestion] = useState(false)
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const utteranceListLength = listOfUtterances[utteranceIndex].length
    let questionInterval;

    const [skin, setSkin] = useState();

    const updateSkin = (skinUpdate) => {
        console.log("updating judge skins ", skinUpdate);
        setSkin(skinUpdate);
    }
    useEffect(() => {
        //File modelPath = new File("./models/");  //gets the model path for models
        //String modelList[] = modelpath.list();   //lists all model urls in the models folder

        //const fs = require('fs');
        // const modelList = fs.readdirSync('./models/');

        const modelList = ['human_female.glb', 'human_male.glb', 'human_male2.glb', 'testvid_default.glb'] //might be better to put this into a json file or db

        const avaliableSkins = modelList;
        if (avaliableSkins.length > 0) {
            setSkin(avaliableSkins[0])
        }

    }, [])

    useEffect(() => {
        if (readyToSpeak) {
            console.log('ready to speak')
            questionInterval = window.setInterval(() => {
                if (nextQuestionTime <= 0 && speaks) {
                    nextQuestionTime = utteranceSplit ? utteranceSplit + Math.random() * 30000 : 180000 + Math.random() * 30000
                    setText(listOfUtterances[utteranceIndex][textIndex])
                    setTextIndex((textIndex + 1) % utteranceListLength)
                } else {
                    nextQuestionTime -= 1000
                }
                console.log(nextQuestionTime)
            }, 1000)
        }
    }, [readyToSpeak])
    const readyToSpeakHandler = () => { // start chain of utterances when avatar has loaded voices, passed down to prop in Avatar
        console.log('calling ready to speak handler')
        if (speaks) {
            setReadyToSpeak(true)
        }
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

    return (<>
        {speaks ? <>{firstQuestion ? <Button clickHandler={() => /*!micStarted? startMic(true): null*/ {
            setText(listOfUtterances[utteranceIndex][textIndex])
            setRepeatingQuestion(!repeatingQuestion)
        }}
            position={[position[0] - 1, position[1] + 3, position[2]]}
            buttonText={"Repeat Question"}
            scale={[2, 2, 2]} /> : null}  <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setUtteranceIndex(0)}
                position={[position[0] - 1, position[1] + 4, position[2]]}
                scale={[2, 2, 2]}
                buttonText={"Utterance List 1"} />
            <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setUtteranceIndex(1)}
                position={[position[0] - 2, position[1] + 4, position[2]]}
                scale={[2, 2, 2]}
                buttonText={"Utterance List 2"} /></> : null}
        <Avatar position={position} modelUrl={'./models/judge_avatar/' + skin} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={repeatingQuestion} animated={animated}></Avatar>
        <SkinSelect updateSkin={updateSkin}> </SkinSelect>
    </>)
}

export default JudgeAvatar;