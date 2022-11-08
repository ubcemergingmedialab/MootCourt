import { Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {Html} from '@react-three/drei'
import "./timer.css"

// if app is active, 1) receive total required time 2) set warning times automatically
// ** do not decrement when timer restarts
function GlobalTimer({isTimerReady, isTimerStarted, timerOverHandler, totalTime, timerWarningHandler, pauseApplicationHandler}) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [previousTime, setPreviousTime] = useState(Date.now());
    const [timeText, setTimeText] = useState("");
    const [updateTimerInterval, setUpdateTimerInterval] = useState(false)
    const [lightColor, setLightColor] = useState("#199E54")
    const times = [{ time: totalTime / 3, message: "", color: "#FAB900" }, { time: totalTime * 2 / 3, message: "", color: "#FA646A" }]
    const [currentTime, setCurrentTime] = useState(totalTime)

    const msToTime = function (duration) {
        // console.log(duration, "duration");
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
    useEffect(() => {
        if (isTimerStarted) {
            setTimeText(msToTime(currentTime))
            // calculate the remaining time after each tick
            setCurrentTime(prevTime => prevTime - elapsedTime)
        }
    }, [updateTimerInterval])

    useEffect(() => {
        if (!isTimerStarted) {
            pauseApplicationHandler();
        }
    }, [isTimerStarted])

    // set time update tick (update at every interval)
    useEffect(() => {
        const timeUpdateInterval = window.setInterval(() => {
            setUpdateTimerInterval(prevUpdate => !prevUpdate)
        }, 1000)
    }, [])

    // calculate elapsed time between each tick
    useEffect(() => {
        setElapsedTime(Date.now() - previousTime);
        setPreviousTime(Date.now());
    }, [updateTimerInterval])

    // cutoff timer when cutoff set to true and time remaining is negative
    useEffect(() => {
        if (currentTime <= 0) {
            timerOverHandler();
        } else if (currentTime <= 0) {
            timerWarningHandler();
        }
    }, [])

    return <>
    <Html fullscreen>
        {isTimerReady ? <div className={"timerContainer"} style={{ bottom: "1em", right: 0, backgroundColor: "white" }}>
            <div className={"timerText"}>{timeText}</div>
            <div className={"timerLight"} style={{ backgroundColor: lightColor }}></div>
        </div> : null}
    </Html>
    </>
}

export default GlobalTimer