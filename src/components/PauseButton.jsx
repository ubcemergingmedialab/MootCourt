import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'
import "./timer.css"
import PropTypes from 'prop-types'

function PauseButton({ togglePause, isPresentationStarted }) {
    const [isPaused, setIsPaused] = useState(false)
    return <>{isPresentationStarted ? <div className={"pauseContainer"} style={{ bottom: "1em", right: 150 }}>
        <button className="pause-button" onClick={() => { togglePause(); setIsPaused(!isPaused) }}>
            {isPaused ? "Continue App" : "Pause App"}
        </button>
    </div> : null}</>
}

PauseButton.propTypes = {
    /** Communicates to parent that the pause button was pressed */
    togglePause: PropTypes.func,
    /** keeps Pause UI from showing until app is in Presentation state */
    isPresentationStarted: PropTypes.bool
}

export default PauseButton;