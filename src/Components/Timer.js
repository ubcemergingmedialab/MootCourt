import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'
import "./timer.css"

function Timer({ isPresentationStarted, startingTime }) {
    const [timeText, setTimeText] = useState("")
    const [lightColor, setLightColor] = useState("#199E54")
    let currentTime = startingTime ? startingTime : 1200000
    let timeIndex = 0;
    const times = [{ time: 900000, message: "", color: "#199E54" }, { time: 600000, message: "", color: "#78C142" }, { time: 450000, message: "", color: "#FAB900" }, { time: 300000, message: "", color: "#FA8700" }, { time: 0, message: "", color: "#FA646A" }] // green, yellow-green, yellow, yellow-red, red
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
        const timeUpdateInterval = setInterval(() => {
            if (currentTime <= times[timeIndex].time) {
                timeIndex++;
            }
            if (timeIndex <= times.length) {
                setLightColor(times[timeIndex].color)
            }
            currentTime -= 1000
            setTimeText(msToTime(currentTime))
        }, 1000)
    }, [])
    return <>{isPresentationStarted ? <div className={"timerContainer"} style={{bottom: -window.innerHeight + 60, left: window.innerWidth - 160, backgroundColor: "white"}}>
        <div className={"timerText"}>{timeText}</div><div className={"timerLight"} style={{ backgroundColor: lightColor }}></div>
    </div> : null}</>
}

export default Timer;