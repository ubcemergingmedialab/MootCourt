import React, { useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import {
} from '@react-three/xr'
import { useFrame, useThree, extend, Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'

import Scene from './Components/Scene'
import Timer from './Components/Timer.js'
import SetupPage from './Components/SetupPage'
import LandingPage from './Components/LandingPage'
import HomePage from './Components/HomePage'


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
  const Presentation = 0
  const Landing = 1
  const Home = 2
  const Setup = 3
  const [appState, setAppState] = useState(Landing)

  const landing = function () {
    setAppState(Landing)
  }
  const home = function () {
    setAppState(Home)
  }
  const setup = function () {
    setAppState(Setup)
  }
  const presentation = function () {
    setAppState(Presentation)
  }

  return (
    <>
      {appState==Presentation ?
        <><Scene></Scene> <Timer isPresentationStarted={appState==Presentation}></Timer></> : null}
      {(appState== Landing)? <LandingPage homePage={home}></LandingPage> : null}
      {(appState== Home) ? <HomePage setupPage={setup}></HomePage> : null}
      {(appState== Setup) ? <SetupPage presentationPage={presentation} homePage={home}></SetupPage> : null}

    </>
  );
}

export default App;
