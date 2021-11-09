import { useEffect, useState } from 'react'
import Avatar from './Avatar.js'
import Button from './Button.js'

function JudgeAvatar({ position, utteranceSplit }) {
    const [currentText, setText] = useState("")
    const [textIndex, setTextIndex] = useState(0)
    const [repeatingQuestion, setRepeatingQuestion] = useState(false)
    const [firstQuestion, setFirstQuestion] = useState(false)
    // useControls hook with a modelUrl variable. Pass in array of available modelUrls
    // eg. modelUrls = ["models/model1.glb", "models/model2.glb"]
    // const { modelUrl } = useControls({modelUrl: {options: modelUrls}})
    const listOfUtterances = [
        "Did not the trial court make some findings of fact contrary to your submissions, and should we not defer to those findings of fact?",
        "Should not we presume that the trial judge knows the law and applied the correct law?",
        "Are not some of the facts of the cases you rely upon much different from the facts of this case?",
        "Could you please tell the Court exactly where you are in your Factum at this point?",
        "What does the opposing counsel say about this submission, and why are they not correct?",
        "As you are aware, we are not bound by any precedents.  Could you please tell the Court why we should follow the law in the main authorities that you rely on?",
        "What are the policy implications of your submissions, and would they take the law in this area in a positive direction?  Are there not some risks of interpreting the law in this manner?",
        "What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?",
        "Were the errors you argue significant enough to justify the remedy you are seeking?  In other words, would the result at trial necessarily have been different if those errors did not occur?"
    ]
    const utteranceListLength = listOfUtterances.length
    const readyToSpeak = () => { // start chain of utterances when avatar has loaded voices
        setFirstQuestion(true)
        setText(listOfUtterances[0])
    }
    useEffect(() => { // when the utterance changes, start wait for the next one
        setTimeout(() => {
            setTextIndex((textIndex + 1) % utteranceListLength)
        }, utteranceSplit ? utteranceSplit + Math.random() * 30000 : 180000 + Math.random() * 30000)
    }, [currentText])
    useEffect(() => { // when utterance index changes, immediately start corresponding utterance
        console.log("text index effect " + textIndex)
        setText(listOfUtterances[textIndex])
    }, [textIndex])

    return (<>
        {firstQuestion ? <Button clickHandler={() => /*!micStarted? startMic(true): null*/ setRepeatingQuestion(!repeatingQuestion)}
            position={[position[0] - 1, position[1], position[2]]}
            rotation={[0.2, 0.2, 0]}
            buttonText={"Pause Animation"} /> : null}

        <Avatar position={position} modelUrl={modelUrl} textToSay={currentText} readyToSpeak={readyToSpeak} utteranceRepeat={repeatingQuestion}></Avatar>
    </>)
}

export default JudgeAvatar;