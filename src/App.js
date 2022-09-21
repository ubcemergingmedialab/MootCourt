import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import {
} from '@react-three/xr'
import { useFrame, useThree, extend, Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'

import Scene from './components/Scene.jsx'
import Timer from './components/Timer.js'
import PauseButton from './components/PauseButton.jsx';
import SetupPage from './components/SetupPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import HomePage from './components/HomePage.jsx'
import ResourcesPage from './components/ResourcesPage'
import DemoPage from './components/DemoPage.jsx'
import DemoPositionButton from './components/Demo_PositionButton';


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
  const Demo = 5
  const [appState, setAppState] = useState(Demo)
  const [config, setConfig] = useState({})
  const [paused, setPaused] = useState(false);
  const [feedbackHover, setFeedbackHover] = useState(false);
  const [timerWarning , setTimerWarning] = useState(false);

  const landing = function () {
    setAppState(Demo)
  }
  const home = function () {
    setAppState(Demo)
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

  const demoPage = function() {
    setAppState(Demo)
  }

  const updateConfig = (config) => {
    console.log('app got new config', JSON.stringify(config))
    setConfig(config)
  }

  const pauseHandler = () => {
    console.log("pause toggle")
    setPaused(prev => !prev)
  }

  const timerWarningHandler = () => {
    setTimerWarning(true)
  }

  return (
    <>
     {appState == Presentation ?
            <><Suspense fallback={null}><Scene appConfig={config} appPaused={paused} timerWarning={timerWarning}></Scene>
            <div style={{display: "flex", flexDirection: "column", alignItems:"flex-end", position: "relative", height: 0}}>
              <div style={{display: "flex", flexDirection: "row", position: "relative", boxSizing: "border-box"}}>
                <PauseButton isPresentationStarted={appState == Presentation} togglePause={pauseHandler} />
                <Timer isPresentationStarted={appState == Presentation} appPaused={paused} cutoff = {config.cutoff} startingTime={(config.totalTime)* 60000} firstWarning={config.firstWarning * 60000} secondWarning={config.secondWarning * 60000} timerOverHandler={landing} timerWarningHandler={timerWarningHandler}></Timer></div>
                    <a onPointerEnter={() => {setFeedbackHover(true); console.log("hover")}} onPointerLeave={()=>{setFeedbackHover(false)}} style={{color:feedbackHover? "brown": "blue", position: "relative", bottom: "1em"}} href={"https://ubc.ca1.qualtrics.com/jfe/form/SV_0qbnf0bR2bTIBo2"}>Give us your feedback!</a></div></Suspense></> : null}
      {(appState == Landing) ? <LandingPage homePage={home}></LandingPage> : null}
      {(appState == Demo) ? 
            <><Suspense fallback={null}><DemoPage presentationPage={presentation} appConfig={config} appPaused={paused} timerWarning={timerWarning}></DemoPage>
            <div style={{display: "flex", flexDirection: "column", alignItems:"flex-end", position: "relative", height: 0}}>
              <div style={{display: "flex", flexDirection: "row", position: "relative", boxSizing: "border-box"}}>
                <PauseButton isPresentationStarted={appState == Presentation} togglePause={pauseHandler} />
                <Timer isPresentationStarted={appState == Presentation} appPaused={paused} cutoff = {config.cutoff} startingTime={(config.totalTime)* 60000} firstWarning={config.firstWarning * 60000} secondWarning={config.secondWarning * 60000} timerOverHandler={landing} timerWarningHandler={timerWarningHandler}></Timer>
                {/* <DemoPositionButton></DemoPositionButton> */}
                </div>
                </div></Suspense></> : null}
      {(appState == Home) ? <HomePage setupPage={setup} resourcesPage={resources} demoPage={demoPage}></HomePage> : null}
      {(appState == Resources) ? <ResourcesPage homePage={home} ></ResourcesPage> : null}
      {(appState == Setup) ? <SetupPage presentationPage={presentation} homePage={home} updateConfig={updateConfig}></SetupPage> : null}
    </>
  );
}

export default App;