import { Suspense, useEffect, useState, useRef } from 'react'
import Avatar from "../avatar_components/Avatar"
import PropTypes from 'prop-types'

function LandingPageJudgeAvatar({animated = true, listOfUtterances}) {
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
        if (readyToSpeak === true) {
            console.log('ready to speak')
        }
    }, [readyToSpeak])

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
        <Avatar appPaused={false} position={[-1.5, -3, 2.5]} rotation={[0, Math.PI/5, 0]} modelUrl={'models/judge_avatar/human_female.glb'} textToSay={currentText} readyToSpeak={readyToSpeakHandler} utteranceRepeat={false} animated={animated} animationPause={animationPaused} finishedSpeaking={finishedSpeakingHandler} startedSpeaking={startedSpeakingHandler}></Avatar>
    </Suspense>)
}


export default LandingPageJudgeAvatar;