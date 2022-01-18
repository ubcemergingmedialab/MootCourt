import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'
import "./timer.css"

function PauseButton({ togglePause }) {
    return <>{isPresentationStarted ? <div className={"pauseContainer"} style={{bottom: 60, left: window.innerWidth - 120, backgroundColor: "white"}}>
        <button type="button" onClick={togglePause}>Pause</button>
    </div> : null}</>
}

export default PauseButton;