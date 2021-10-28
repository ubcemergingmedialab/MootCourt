import { useEffect, useState } from 'react'
import Avatar from './Avatar.js'

function JudgeAvatar({ position, modelUrl, utteranceSplit }) {
    const [currentText, setText] = useState("")
    const [textIndex, setTextIndex] = useState(0)
    const listOfUtterances = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Vestibulum in risus in diam consequat tempus porttitor vel mi.",
        "Proin quis diam at augue molestie sollicitudin.",
        "Cras fermentum turpis sed odio pellentesque, eget facilisis magna ornare.",
        "Aenean id turpis in tellus mollis suscipit.",
        "In et felis laoreet, feugiat nisl nec, sodales leo."
    ]
    const utteranceListLength = listOfUtterances.length
    const readyToSpeak = () => { // start chain of utterances when avatar has loaded voices
        setText(listOfUtterances[0])
    }
    useEffect(() => { // when the utterance changes, start wait for the next one
        setTimeout(() => {
            setTextIndex((textIndex + 1) % utteranceListLength)
        }, utteranceSplit? utteranceSplit : 5000)
    }, [currentText])
    useEffect(() => { // when utterance index changes, immediately start corresponding utterance
        console.log("text index effect " + textIndex)
        setText(listOfUtterances[textIndex])
    }, [textIndex])
    return (<>
        <Avatar position={position} modelUrl={modelUrl} textToSay={currentText} readyToSpeak={readyToSpeak}></Avatar>
    </>)
}

export default JudgeAvatar;