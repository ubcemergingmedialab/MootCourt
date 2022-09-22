import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import {
} from '@react-three/xr'
import { useFrame, useThree, extend, Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'

import AppellantScene from './components/Scene-Appellant.jsx'
import RespondentScene from './components/Scene-Respondent.jsx'
import Timer from './components/Timer.js'
import PauseButton from './components/PauseButton.jsx';
import HomePage from './components/HomePage.jsx'
import DemoPage from './components/DemoPage.jsx'


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
  const a_presentation = 0
  const r_presentation = 1
  const Home = 2
  const Setup = 3
  const Resources = 4
  const Demo = 5
  const [appState, setAppState] = useState(Home)
  const [config, setConfig] = useState({})
  const [paused, setPaused] = useState(false);
  const [feedbackHover, setFeedbackHover] = useState(false);
  const [timerWarning , setTimerWarning] = useState(false);

  const landing = function () {
    setAppState(Home)
  }
  const home = function () {
    setAppState(Home)
  }
  const appellantPresentation = function () {
    setAppState(a_presentation)
  }

  const respondentPresentation = function () {
    setAppState(r_presentation)
  }

  const demoPage = function() {
    setAppState(Demo)
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
     {appState === a_presentation ?
            <><Suspense fallback={null}><AppellantScene appPaused={paused} timerWarning={timerWarning}></AppellantScene>
            <div style={{display: "flex", flexDirection: "column", alignItems:"flex-end", position: "relative", height: 0}}>
              <div style={{display: "flex", flexDirection: "row", position: "relative", boxSizing: "border-box"}}>
                <PauseButton isPresentationStarted={appState === a_presentation} togglePause={pauseHandler} />
                <Timer isPresentationStarted={appState === a_presentation} appPaused={paused} cutoff = {config.cutoff} startingTime={(config.totalTime)* 60000} firstWarning={config.firstWarning * 60000} secondWarning={config.secondWarning * 60000} timerOverHandler={landing} timerWarningHandler={timerWarningHandler}></Timer></div>
            </div></Suspense></> : null}
      {appState === r_presentation ?
        <><Suspense fallback={null}><RespondentScene appPaused={paused} timerWarning={timerWarning}></RespondentScene>
            <div style={{display: "flex", flexDirection: "column", alignItems:"flex-end", position: "relative", height: 0}}>
              <div style={{display: "flex", flexDirection: "row", position: "relative", boxSizing: "border-box"}}>
                <PauseButton isPresentationStarted={appState === r_presentation} togglePause={pauseHandler} />
                <Timer isPresentationStarted={appState === r_presentation} appPaused={paused} cutoff = {config.cutoff} startingTime={(config.totalTime)* 60000} firstWarning={config.firstWarning * 60000} secondWarning={config.secondWarning * 60000} timerOverHandler={landing} timerWarningHandler={timerWarningHandler}></Timer></div>
                </div></Suspense></> : null}
      {(appState === Demo) ? 
            <><Suspense fallback={null}><DemoPage presentationPage={appellantPresentation} appConfig={config} appPaused={paused} timerWarning={timerWarning}></DemoPage>
            <div style={{display: "flex", flexDirection: "column", alignItems:"flex-end", position: "relative", height: 0}}>
              <div style={{display: "flex", flexDirection: "row", position: "relative", boxSizing: "border-box"}}>
                </div>
              </div></Suspense></> : null}
      {(appState === Home) ? <HomePage demoPage={demoPage} a_presentationPage={appellantPresentation} r_presentationPage={respondentPresentation}></HomePage> : null}
    </>
  );
}

export default App;