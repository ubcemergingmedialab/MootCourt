import { useEffect, useState } from 'react'
import "../general/timer.css"
import {Html} from '@react-three/drei'
import PropTypes from 'prop-types'

function BackToSceneButton({ updateAppState }) {
    // internal check of pause state to change button setting

    return <>
    {<div className={"pauseContainer"} style={{ bottom: "1em", right: 150 }}>
        <button className="pause-button" onClick={() => { updateAppState(1)}}>
            {"Back to Scene"}
        </button>
    </div>}
    </>
}

export default BackToSceneButton;