import { Suspense, useEffect, useState } from 'react'
import "./timer.css"

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

// if app is active, 1) receive total required time 2) set warning times automatically
// ** do not decrement when timer restarts
// time received in seconds, convert to ms for more accurate time count
function GlobalTimer({hasAppIntroStarted, setHasAppIntroStarted, isAppInIntro, setIsAppInIntro, config, setJudgeSpeechText, appPaused, updateAppState, currentTime, setCurrentTime, noNegativeTime, judgeElapsedTime, setJudgeElapsedTime, shouldUpdateJudgeElapsedTime, setShouldUpdateJudgeElapsedTime}) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [previousTime, setPreviousTime] = useState(Date.now());
    const [timeText, setTimeText] = useState("");
    // set warning state to 1 if timer goes to negative
    const [warningState, setWarningState] = useState(0);
    const [updateTimerInterval, setUpdateTimerInterval] = useState(false)
    const [lightColor, setLightColor] = useState("#199E54")
    const warningColor = "#FA646A"
    const pauseColor = "#FF0000" 

    // judge time controller
    if (config.setRandomized) {
        shuffle(config.AQuestions)
        shuffle(config.RQuestions)
    }
    const listOfUtterances = config.playerPosition === "Appellant"? config.AQuestions : config.RQuestions
    const questionInterval = config.questionInterval * 1000
    const [judgeQuestionIndex, setJudgeQuestionIndex] = useState(0);

    function resetQuestionIndex() {
        // loop back to initial quetion if the index is equal to the length of speech list.
        // if not, increment the index by one.
        if (judgeQuestionIndex >= listOfUtterances.length - 1) {
            setJudgeQuestionIndex(0)
        } else {
            setJudgeQuestionIndex(judgeQuestionIndex + 1)
        }
    }

    useEffect(() => {
        // if the judge elapsed time exceeds the interval,
        // inform the app that the judge elapsed time will be updated.
        // console.log("updating time for judge")
        // wait 5 seconds for judge
        // console.log("judgeElapsedTime:", judgeElapsedTime / 1000)
        if (!hasAppIntroStarted && judgeElapsedTime > 5000) {
            console.log(listOfUtterances)
            setHasAppIntroStarted(true)
            setJudgeSpeechText(config.judgeIntroSpeech)
            setJudgeElapsedTime(0)
            setIsAppInIntro(true)
        }
        if (isAppInIntro) {
            console.log("app is in intro")
            if (judgeElapsedTime >= config.introductionTime * 1000) {
                setIsAppInIntro(false)
                setShouldUpdateJudgeElapsedTime(true)
                console.log("utterance: ", listOfUtterances[judgeQuestionIndex])
                setJudgeSpeechText(listOfUtterances[judgeQuestionIndex])
                resetQuestionIndex()
                console.log("judge index", judgeQuestionIndex)
            }
        } else if (judgeElapsedTime >= questionInterval) {
            console.log("judge elapsed time goes over interval")
            setShouldUpdateJudgeElapsedTime(true)
            console.log("utterance: ", listOfUtterances[judgeQuestionIndex])
            setJudgeSpeechText(listOfUtterances[judgeQuestionIndex])
            resetQuestionIndex()
            console.log("judge index", judgeQuestionIndex)
        }
    }, [judgeElapsedTime])



    // Displaying remaining time in milliseconds as minute:second format.
    // if negative values are enabled, keep counting down instead of going back to the landing page.
    const msToTimeDisplay = function (duration) {
        let isTimeNegative = duration < 0;
        // use absolute time to calculate displayed time
        duration = Math.abs(duration);
        let milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000)) % 60,
            minutes = Math.floor(duration / (1000 * 60)) % 60,
            hours = Math.floor(duration / (1000 * 60 * 60) % 24);
        let appendToMin = "";
        let appendToSecond = "";
        // if the value is negative, append '-' before the minute counter
        appendToMin = minutes < 10 ? "0" + appendToMin : appendToMin;
        appendToMin = isTimeNegative ? "-" + appendToMin : appendToMin;
        appendToSecond = seconds < 10 ? "0" + appendToSecond : appendToSecond;
        let minuteInString = appendToMin + minutes;
        let secondsInString = appendToSecond + seconds;
        return minuteInString + ":" + secondsInString
    }

    // When the app pauses, reset the elapsed time as 0 so the timer doesn't decrement too fast
    // when the pause-play button is repeatedly pressed

    useEffect(() => {
        console.log("app pause status change")
        setElapsedTime(0)
    }, [appPaused])

    // If app is in play mode, update the timer text and "current time" (remaining time in the countdown)
    useEffect(() => {
        if (!appPaused) {
            setTimeText(msToTimeDisplay(currentTime))
            if (warningState === 0) {
                if (currentTime <= 0) {
                    setLightColor(warningColor)
                    setWarningState(1)
                } else {
                    // If timer is running, the state is set back to green
                    setLightColor("#199E54")
                }
            }
            setJudgeElapsedTime(judgeElapsedTime + elapsedTime)
            // calculate the remaining time after each tick
            setCurrentTime(prevTime => prevTime - elapsedTime)
        } else {
            // Otherwise, when the app is paused, set timer to red
            setLightColor(pauseColor)
        }
    }, [updateTimerInterval])

 

    // if interval should be reset, this function runs.
    useEffect(() => {
        if (!appPaused && shouldUpdateJudgeElapsedTime) {
            setJudgeElapsedTime(0)
            setShouldUpdateJudgeElapsedTime(false)
        }
    }, [shouldUpdateJudgeElapsedTime])

    // Every 1000 milliseconds, update the timer.
    // Note that the frequency of this function running is not always 1000ms -
    // Store a separate counter to accurately calculate time elapsed between two frames of the app (see useEffect below)
    useEffect(() => {
        const timeUpdateInterval = window.setInterval(() => {
            setUpdateTimerInterval(prevUpdate => !prevUpdate)
        }, 1000)
    }, [])

    // calculate elapsed time between each tick
    useEffect(() => {
        setElapsedTime(Date.now() - previousTime);
        setPreviousTime(Date.now());
        // console.log("current time", currentTime)
    }, [updateTimerInterval])

    // if no negative time is set to true, return to landing page
    useEffect(() => {
        if (currentTime <= 0 && noNegativeTime) {
            updateAppState(0);
        }
    }, [updateTimerInterval])

    return <>
        {<div className={"timerContainer"}>
            <div className={"timerText"}>{timeText}</div>
            <div className={"timerLight"} style={{ backgroundColor: lightColor }}></div>
        </div>}
    </>
}

export default GlobalTimer
