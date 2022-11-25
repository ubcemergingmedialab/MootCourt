import { useEffect, useState } from 'react'
import "./timer.css"
import {Html} from '@react-three/drei'
import PropTypes from 'prop-types'

function PauseButton({ togglePause }) {
    // internal check of pause state to change button setting
    const [isPaused, setIsPaused] = useState(false)

    return <>
    {<div className={"pauseContainer"} style={{ bottom: "1em", right: 150 }}>
        <button className="pause-button" onClick={() => { togglePause(); setIsPaused(!isPaused) }}>
            {isPaused ? "Continue App" : "Pause App"}
        </button>
    </div>}
    </>
}

PauseButton.propTypes = {
    /** Communicates to parent that the pause button was pressed */
    togglePause: PropTypes.func,
    /** keeps Pause UI from showing until app is in Presentation state */
    isPresentationStarted: PropTypes.bool
}

export default PauseButton;