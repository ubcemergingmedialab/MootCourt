import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import Model from '../general/Model.js'
import {Html, useTexture} from "@react-three/drei";
import AppSettings from '../general/AppSettings.js'
import GlobalTimer from '../general/GlobalTimer'
import PauseButton from '../buttons/PauseButton'
import SceneJudgeAvatar from '../avatars/SceneJudgeAvatar'
import BackToLandingButton from '../buttons/BackToLandingButton';
import SceneMenu from '../ui/SceneMenu'

let appPaused = false

export default function GeneralScene({appConfig, appPaused, togglePause, updateAppState}) {
    return (<Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <SceneJudgeAvatar config={appConfig}
                appPaused={appPaused}></SceneJudgeAvatar>
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
                <GlobalTimer appPaused={appPaused} updateAppState={updateAppState} totalTime={appConfig.totalTime} noNegativeTime={appConfig.stopPresentation}></GlobalTimer>
                <PauseButton togglePause={togglePause}></PauseButton>
                {/* <SceneMenu updateAppState={updateAppState}></SceneMenu> */}
                <BackToLandingButton updateAppState={updateAppState}></BackToLandingButton>
                </Html>
            </Canvas>
    )
}