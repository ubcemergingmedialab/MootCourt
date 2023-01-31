import * as THREE from 'three'
import React, { useRef, useState, useEffect} from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import Model from '../general/Model.js'
import {Html, useTexture} from "@react-three/drei";
import AppSettings from '../general/AppSettings.js'
import GlobalTimer from '../general/GlobalTimer'
import PauseButton from '../buttons/PauseButton'
import SceneJudgeAvatar from '../avatars/SceneJudgeAvatar'
import BackToLandingButton from '../buttons/BackToLandingButton';
import SceneMenu from '../ui/SceneMenu'
import JudgeTimedSpeech from '../avatar_components/JudgeTimedSpeech';

export default function GeneralScene({appConfig, appPaused, togglePause, updateAppState}) {
    // Scene Specific Elements are stored here
    // 1: Text that judge is supposed to say at given interval
    const [judgeSpeechText, setJudgeSpeechText] = useState("Default speech text for judge.")
    // 2: Time elapsed since the start of the interval. Resets if the user delays speech. 
    // Moves onto next question when elapsed time equals the config interval
    const [judgeElapsedTime, setJudgeElapsedTime] = useState(0)
    // 3: Stores the current global time of the scene since the beginning.
    // Starting value: config's total time (in seconds) converted to ms
    const [currentTime, setCurrentTime] = useState(appConfig.totalTime * 1000)
    // 4: Track whether the judge interval should be updated or not.
    const [shouldUpdateJudgeElapsedTime, setShouldUpdateJudgeElapsedTime] = useState(false);

    useEffect(() => {
        console.log("current judge time being updated:", judgeElapsedTime)
    }, [judgeElapsedTime])

    return (<Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <JudgeTimedSpeech
                config={appConfig}
                judgeElapsedTime={judgeElapsedTime}
                setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
                setJudgeSpeechText={setJudgeSpeechText}>
                </JudgeTimedSpeech>
                <SceneJudgeAvatar config={appConfig} appPaused={appPaused}></SceneJudgeAvatar>
                <Model modelUrl="./models/courtroompropsNov17.glb"
                    pos={[0, -3, 3]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomwallsJan25.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomdesksNov17.glb"
                    pos={[0, -3.25, 4.5]}
                    rot={[0, 0, 0]}
                    sca={[0.055, 0.055, 0.055]} />
                {/* Wrap all the HTML components here */}
                <Html fullscreen>
                <GlobalTimer
                appPaused={appPaused}
                updateAppState={updateAppState}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                noNegativeTime={appConfig.stopPresentation}
                judgeElapsedTime={judgeElapsedTime}
                setJudgeElapsedTime={setJudgeElapsedTime}
                setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
                shouldUpdateJudgeElapsedTime={shouldUpdateJudgeElapsedTime}></GlobalTimer>
                <PauseButton togglePause={togglePause}></PauseButton>
                {/* <SceneMenu updateAppState={updateAppState}></SceneMenu> */}
                <BackToLandingButton updateAppState={updateAppState}></BackToLandingButton>
                </Html>
            </Canvas>
    )
}