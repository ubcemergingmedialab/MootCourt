import React, {useEffect, useState } from 'react'

/**
 * Updates new speech to be said by judge according to the timer status and app setting.
 */
function JudgeTimedSpeech(config, judgeElapsedTime, setShouldUpdateJudgeElapsedTime, setJudgeSpeechText) {
    // 1: list of questions the judge can ask depending on user position
    const listOfUtterances = config.playerPosition === "Appellant"? config.AQuestions : config.RQuestions
    // 2: interval between each question, set by user config. Stored in seconds for config, used as ms here
    const questionInterval = config.questionInterval * 1000

    const [judgeQuestionIndex, setJudgeQuestionIndex] = useState(0);

    function resetQuestionIndex() {
        // loop back to initial quetion if the index is equal to the length of speech list.
        // if not, increment the index by one. 
        if (judgeQuestionIndex >= listOfUtterances.length) {
            setJudgeQuestionIndex(0)
        } else {
            setJudgeQuestionIndex(judgeQuestionIndex + 1)
        }
    }

    useEffect(() => {
        // if the judge elapsed time exceeds the interval,
        // inform the app that the judge elapsed time will be updated.
        console.log("updating time for judge")
        if (judgeElapsedTime >= questionInterval) {
            console.log("judge elapsed time goes over interval")
            setShouldUpdateJudgeElapsedTime(true)
            resetQuestionIndex()
        }
        console.log("judge elapsed time:", judgeElapsedTime)
    }, [judgeElapsedTime])

    return (<></>)
}

export default JudgeTimedSpeech;