import { Suspense, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Avatar_NPC from '../avatar_components/AvatarNPC'

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
    const [isSpeaking, setIsSpeaking] = useState(false)

    return (<Suspense fallback={null}>
        <Avatar_NPC
            appPaused={false}
            position={[-1.5, -3, 2.5]}
            rotation={[0, Math.PI/5, 0]}
            modelUrl={'models/judge_avatar/judge_landing_page.glb'}
            animated={animated}
            animationPause={true} ></Avatar_NPC>
    </Suspense>)
}

export default LandingPageJudgeAvatar;