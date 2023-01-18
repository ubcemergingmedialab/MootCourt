import { useEffect, useState } from 'react'
import "../general/timer.css"
import {Html} from '@react-three/drei'
import PropTypes from 'prop-types'

function BackToLandingButton({ updateAppState }) {
    // internal check of pause state to change button setting

    return <>
    {<div className={"pauseContainer"} style={{ bottom: "1em", left: 150 }}>
        <button className="pause-button" onClick={() => { updateAppState(0)}}>
            {"Back to Setup"}
        </button>
    </div>
    }
    </>
}

export default BackToLandingButton;