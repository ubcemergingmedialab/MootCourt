import { Suspense, useEffect, useState, useRef } from 'react'
import Avatar from "../avatar_components/Avatar"
import PropTypes from 'prop-types'

function LandingPageJudgeAvatar({animated = true, listOfUtterances}) {
    const [currentText, setText] = useState("initial text state")
    const [readyToSpeak, setReadyToSpeak] = useState(false)
    const [skinState, setSkinState] = useState("")
    const [isSpeaking, setIsSpeaking] = useState(false)

    const readyToSpeakHandler = () => { // start chain of utterances when avatar has loaded voices, passed down to prop in Avatar
        console.log('updating ready to speak')
        setReadyToSpeak(true)
    }

    const startedSpeakingHandler = () => {
    }

    const finishedSpeakingHandler = () => {
    }

    return (<Suspense fallback={null}>
        <Avatar isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} appPaused={false} position={[-1.5, -3, 2.5]} rotation={[0, Math.PI/5, 0]} modelUrl={'models/judge_avatar/human_female.glb'} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={true}finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
    </Suspense>)
}


export default LandingPageJudgeAvatar;