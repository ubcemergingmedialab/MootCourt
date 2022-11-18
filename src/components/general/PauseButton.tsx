import { useEffect, useState } from 'react'
import Button from './Button'
import "./timer.css"
import {Html} from '@react-three/drei'
import PropTypes from 'prop-types'

function PauseButton({ togglePause }) {
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        console.log('Pause button toggled')
    }, [isPaused])

    return <>
    <Html fullscreen>
    {<div className={"pauseContainer"} style={{ bottom: "1em", right: 150 }}>
        <button className="pause-button" onClick={() => { setIsPaused(!isPaused) }}>
            {isPaused ? "Continue App" : "Pause App"}
        </button>
    </div>}
    </Html>
    </>
}

PauseButton.propTypes = {
    /** Communicates to parent that the pause button was pressed */
    togglePause: PropTypes.func,
    /** keeps Pause UI from showing until app is in Presentation state */
    isPresentationStarted: PropTypes.bool
}

export default PauseButton;