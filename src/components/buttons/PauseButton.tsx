import { useEffect, useState } from 'react'
import "../general/timer.css"
import {Html} from '@react-three/drei'
import PropTypes from 'prop-types'

function PauseButton({ togglePause }) {
    // internal check of pause state to change button setting
    const [isPaused, setIsPaused] = useState(false)

    return <>
    {<div className={"pauseContainer sceneButtonContainer"}>
        <button className="scene-button" onClick={() => { togglePause(); setIsPaused(!isPaused) }}>
            {isPaused ? "Pause App" : "Pause App"}
        </button>
    </div>}
    </>
}

export default PauseButton;
