import { useEffect, useState } from 'react'
import "../general/timer.css"
import {Html} from '@react-three/drei'
import PropTypes from 'prop-types'
import defaultData from '../general/default_settings.json';

function BackToLandingButton({ updateAppState, setPaused, updateConfig}) {
    // internal check of pause state to change button setting

    return <>
    {<div className={"sceneButtonContainer"}>
        <button className="scene-button pause-button" onClick={() => { updateAppState(0); setPaused(false); updateConfig(defaultData)}}>
            {"Back to Menu"}
        </button>
    </div>
    }
    </>
}

export default BackToLandingButton;
