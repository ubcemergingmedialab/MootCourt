import React, { useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import {
} from '@react-three/xr'
import { useFrame, useThree, extend, Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'

import Model from './Components/Model.js'
import Avatar from './Components/Avatar.js'
import Compass from './Components/Compass.js'
import JudgeAvatar from './Components/JudgeAvatar.js'
import Player from './Components/Player.js'
import SettingsPage from './Components/SettingsPage'
import Timer from './Components/Timer.js'
import Scene from './Components/Scene'

extend({ OrbitControls })

const Controls = () => {
  const orbitRef = useRef();
  const { camera, gl } = useThree();
  useFrame((delta, state) => {
    orbitRef.current.update();
  })
  return (
    <orbitControls
      maxPolarAngle={Math.PI * 2}
      minPolarAngle={Math.PI / 3}
      ref={orbitRef}
      args={[camera, gl.domElement]}
    />
  )
}

function App() {
  const [presentationStarted, setPresentationStarted] = useState(false)
  const [settingsPageActive, setSettingsPageActive] = useState(false)
  const hideSettingsPage = function () {
    setSettingsPageActive(false)
  }
  return (
    <>
      {presentationStarted ?
        <><Scene></Scene><Timer isPresentationStarted={presentationStarted}></Timer></> : <>
          <button type="button" onClick={() => { setPresentationStarted(true) }}>Start Moot Practice</button>
          <button type="button" onClick={() => { setSettingsPageActive(true) }}>Settings </button>

          {settingsPageActive ? <SettingsPage hideSettingsPage={hideSettingsPage}></SettingsPage> : null}</>}
    </>
  );
}

export default App;
