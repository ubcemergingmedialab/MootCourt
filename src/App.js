import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import {
} from '@react-three/xr'
import { useFrame, useThree, extend, Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'

import Scene from './Components/Scene'
import Timer from './Components/Timer.js'
import PauseButton from './Components/PauseButton';
import SetupPage from './Components/SetupPage'
import LandingPage from './Components/LandingPage'
import HomePage from './Components/HomePage'
import ResourcesPage from './Components/ResourcesPage'


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
  const Resources = 4
  const [appState, setAppState] = useState(Landing)
  const [config, setConfig] = useState({})
  const [paused, setPaused] = useState(false);
  const [feedbackHover, setFeedbackHover] = useState(false);

  const landing = function () {
    setAppState(Landing)
  }
  const home = function () {
    setAppState(Home)
  }
  const setup = function () {
    setAppState(Setup)
  }
  const resources = function () {
    setAppState(Resources)
  }
  const presentation = function () {
    setAppState(Presentation)
  }

  const updateConfig = (config) => {
    console.log('app got new config', JSON.stringify(config))
    setConfig(config)
  }

  const pauseHandler = () => {
    console.log("pause toggle")
    setPaused(prev => !prev)
  }

  return (
    <>
     {appState == Presentation ?
            <><Suspense fallback={null}><Scene appConfig={config} appPaused={paused}></Scene>
            <div style={{display: "flex", flexDirection: "column", alignItems:"flex-end", position: "relative", height: 0}}>
              <div style={{display: "flex", flexDirection: "row", position: "relative", boxSizing: "border-box"}}>
                <PauseButton isPresentationStarted={appState == Presentation} togglePause={pauseHandler} />
                <Timer isPresentationStarted={appState == Presentation} appPaused={paused} cutoff = {config.cutoff} startingTime={(config.totalTime)* 60000} firstWarning={config.firstWarning * 60000} secondWarning={config.secondWarning * 60000} timerOverHandler={landing}></Timer></div>
                    <a onPointerEnter={() => {setFeedbackHover(true); console.log("hover")}} onPointerLeave={()=>{setFeedbackHover(false)}} style={{color:feedbackHover? "brown": "blue", position: "relative", bottom: "1em"}} href={"https://ubc.ca1.qualtrics.com/jfe/form/SV_0qbnf0bR2bTIBo2"}>Give us your feedback!</a></div></Suspense></> : null}
      {(appState == Landing) ? <LandingPage homePage={home}></LandingPage> : null}
      {(appState == Home) ? <HomePage setupPage={setup} resourcesPage={resources}></HomePage> : null}
      {(appState == Resources) ? <ResourcesPage homePage={home} ></ResourcesPage> : null}
      {(appState == Setup) ? <SetupPage presentationPage={presentation} homePage={home} updateConfig={updateConfig}></SetupPage> : null}
    </>
  );
}

export default App;