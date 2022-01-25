import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'
import "./timer.css"

function PauseButton({ togglePause, isPresentationStarted }) {
    const [isPaused, setIsPaused] = useState(false)
    return <>{isPresentationStarted ? <div className={"pauseContainer"} style={{ bottom: 8, right: 150, backgroundColor: "white" }}>
        <button style={{ "border": "1px solid #000000" }} type="button" onClick={() => { togglePause(); setIsPaused(!isPaused) }}>
            {isPaused ? "Continue App" : "Pause App"}
        </button>
    </div> : null}</>
}

export default PauseButton;