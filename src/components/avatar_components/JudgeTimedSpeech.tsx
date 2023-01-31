import React, { Suspense, useEffect, useRef, useState } from 'react'
import AnimationComponent from './AnimationComponent';
import VoiceComponent from './VoiceComponent';

/**
 * Updates new speech to be said by judge according to the timer status and app setting.
 */
function JudgeTimedSpeech(config, currentTime, appPaused, setJudgeSpeechText) {
    const listOfUtterances = config.playerPosition === "Appellant"? config.AQuestions : config.RQuestions
    const questionInterval = config.questionInterval

    const [judgeElapsedTime, setJudgeElapsedTime] = useState(0)
    
    return (<>
    </>
    )

}

export default JudgeTimedSpeech;