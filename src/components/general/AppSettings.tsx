import React, { Suspense, useEffect, useRef, useState } from 'react'

/**
 * 
 */
function AppSettings() {
    // is the player Appellant or Respondent?
    const [playerPosition, setPlayerPosition] = useState();
    // How long should the total duration of the mock trial be?
    const [totalTime, setTotalTime] = useState();
    // How many minutes should the judge wait to ask the next question?
    const [questionInterval, setQuestionInterval] = useState();
    // List of Appellant Questions
    const [AQuestions, setAQuestions] = useState();
    // List of Respondent Questions
    const [RQuestions, setRQuestions] = useState();

    return (<></>)

}

export default AppSettings;