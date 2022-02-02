import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'
import "./timer.css"

function Timer({ isPresentationStarted, startingTime, appPaused, firstWarning }) {
    const [timeText, setTimeText] = useState("")
    const [lightColor, setLightColor] = useState("#199E54")
    const [updateTimerInterval, setUpdateTimerInterval] = useState(false)
    const [currentTime, setCurrentTime] = useState(startingTime ? startingTime : 1200000)
    let timeIndex = 0;
    const times = [{ time: firstWarning, message: "", color: "#199E54" }, { time: 600000, message: "", color: "#78C142" }, { time: 450000, message: "", color: "#FAB900" }, { time: 300000, message: "", color: "#FA8700" }, { time: 0, message: "", color: "#FA646A" }] // green, yellow-green, yellow, yellow-red, red
    const msToTime = function (duration) {
        let milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return minutes + ":" + seconds
    }

    useEffect(() => {
        if (appPaused === false) {
            console.log('timer click', currentTime)
            setTimeText(msToTime(currentTime))
            if (currentTime <= times[timeIndex].time) {
                timeIndex++;
            }
            if (timeIndex <= times.length) {
                setLightColor(times[timeIndex].color)
            }
            setCurrentTime(prevTime => prevTime - 1000)
        }
    }, [updateTimerInterval, appPaused])
    useEffect(() => {
        const timeUpdateInterval = window.setInterval(() => {
            setUpdateTimerInterval(prevUpdate => !prevUpdate)
        }, 1000)
    }, [])
    return <>{isPresentationStarted ? <div className={"timerContainer"} style={{ bottom: 8, right: 10 }}>
        <div className={"timerText"}>{timeText}</div><div className={"timerLight"} style={{ backgroundColor: lightColor }}></div>
    </div> : null}</>
}

export default Timer;