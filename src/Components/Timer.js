import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'
import "./timer.css"
import PropTypes from 'prop-types'


function Timer({ isPresentationStarted, cutoff, startingTime, appPaused, firstWarning, secondWarning, timerOverHandler, setAppState, timerWarningHandler }) {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [previousTime, setPreviousTime] = useState(Date.now());
    const [timeIndex, incrementTimeIndex] = useState(0);
    const [timeText, setTimeText] = useState("")
    const [lightColor, setLightColor] = useState("#199E54")
    const [updateTimerInterval, setUpdateTimerInterval] = useState(false)
    const [currentTime, setCurrentTime] = useState(startingTime ? startingTime : 1200000)
    const times = [{ time: firstWarning, message: "", color: "#FAB900" }, { time: secondWarning, message: "", color: "#FA646A" }]
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
        minutes = appendToMin + minutes;
        seconds = appendToSecond + seconds;
        return minutes + ":" + seconds
    }


    useEffect(() => {
        if (appPaused === false) {
            setTimeText(msToTime(currentTime))
            if (timeIndex < times.length) {
                if (currentTime <= times[timeIndex].time) {
                    setLightColor(times[timeIndex].color)
                    incrementTimeIndex(timeIndex + 1);
                }
            }
            // calculate the remaining time after each tick
            setCurrentTime(prevTime => prevTime - elapsedTime)
        }
    }, [updateTimerInterval, appPaused])

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
        if (cutoff && currentTime <= 0) {
            timerOverHandler();
        } else if (currentTime <= 0) {
            timerWarningHandler();
        }
    }, [cutoff, updateTimerInterval])

    return <>
        {isPresentationStarted ? <div className={"timerContainer"} style={{ bottom: "1em", right: 0, backgroundColor: "white" }}>
            <div className={"timerText"}>{timeText}</div>
            <div className={"timerLight"} style={{ backgroundColor: lightColor }}></div>
        </div> : null}
    </>
}

Timer.propTypes = {
    /** keeps timer from starting before presentation does */
    isPresentationStarted: PropTypes.bool,
    /** if true, timer will call timerOverHandler which ends the presentation, otherwise timerWarningHandler is used */
    cutoff: PropTypes.bool,
    /** number of milliseconds the timer will start counting down from*/
    startingTime: PropTypes.number,
    /** stops timer counting if true */
    appPaused: PropTypes.bool,
    /** configures timer to change to yellow after this many milliseconds */
    firstWarning: PropTypes.number,
    /** configures timer to change to red after this many milliseconds */
    secondWarning: PropTypes.number,
    /** gets called if cutoff is true and when timer runs to 0 */
    timerOverHandler: PropTypes.func,
    /** gets called if cutoff is false and when timer runs to 0 */
    timerWarningHandler: PropTypes.func
}

export default Timer;