import * as THREE from 'three'
import React, {useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import Model from '../general/Model.js'
import {Html, useTexture} from "@react-three/drei"
import LandingPageJudgeAvatar from '../avatars/LandingPageJudgeAvatar'
import LandingPageMenu from '../ui/LandingPageMenu'

let appPaused = false

const lou = []

export default function LandingPage({updateAppState, updateConfig, config}) {
    return (<Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <LandingPageJudgeAvatar listOfUtterances={lou}></LandingPageJudgeAvatar>
                <Model modelUrl="./models/courtroompropsNov17.glb"
                    pos={[0, -3, 3]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomwallsJan25.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
        <Html fullscreen>
            <LandingPageMenu updateAppState={updateAppState} updateConfig={updateConfig} config={config} ></LandingPageMenu>
        </Html>
        </Canvas>
    )
}