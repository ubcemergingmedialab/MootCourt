import React, { useEffect, useRef, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit';
import {
  VRCanvas,
  useXREvent,
  Hands,
  Select,
  Hover,
  useXR,
  Interactive,
  RayGrab,
  useHitTest,
  ARCanvas,
  DefaultXRControllers,
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
import Timer from './Components/Timer.js'
import SetupPage from './Components/SetupPage'
import LandingPage from './Components/LandingPage'
import HomePage from './Components/HomePage'
import AddQuestionsPopup from './Components/AddQuestionsPopup'


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

function HitTestExample() {
  const ref = useRef()

  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  return <Box ref={ref} args={[0.1, 0.1, 0.1]} />
}

function App() {
  const Presentation = 0
  const Landing = 1
  const Home = 2
  const Setup = 3
  const AddQuestions = 4
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
  const addQuestions = function (){
    setAppState(AddQuestions)
  }

  const updateConfig = (config) => {
    console.log('app got new config', JSON.stringify(config))
  }

  return (
    <>
      {appState==Presentation ?
        <>
          <VRCanvas style={{ position: "absolute" }}>
            <Compass ></Compass>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Hands
            // modelLeft={"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/left-hand-black-webxr-tracking-ready/model.gltf"}
            // modelRight={"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/right-hand-black-webxr-tracking-ready/model.gltf"}
            />
            {
              //<Avatar position={[-3,-4, -2]} rotation={[0, 0.8, 0]} buttonOffset={[-2, 4, 0]} modelUrl={"./models/testvid_default.glb"}/>
            }
            <JudgeAvatar position={[-2, -2, -4]} utteranceSplit={180000} animated={false} />

            <JudgeAvatar position={[0, -2, -4]} utteranceSplit={180000} speaks={true} />

            <JudgeAvatar position={[2, -2, -4]} utteranceSplit={180000} animated={false} />
            <Model modelUrl="./models/courtroompropsNov17.glb"
              pos={[0, -3, 3.5]}
              rot={[0, 0, 0]}
              sca={[0.06, 0.06, 0.06]} />
            <Model modelUrl="./models/courtroomwallsNov17.glb"
              pos={[0, -3, 3.5]}
              rot={[0, 0, 0]}
              sca={[0.06, 0.06, 0.06]} />
            <Model modelUrl="./models/courtroomdesksNov17.glb"
              pos={[0, -3, 3.5]}
              rot={[0, 0, 0]}
              sca={[0.06, 0.06, 0.06]} />
            <DefaultXRControllers />
            <Player startPosition={[0, 0.5, 0]} />
          </VRCanvas> <Timer isPresentationStarted={appState==Presentation}></Timer></> : null}
      {(appState== Landing)? <LandingPage homePage={home}></LandingPage> : null}
      {(appState== Home) ? <HomePage setupPage={setup}></HomePage> : null}
      {(appState== Setup) ? <SetupPage presentationPage={presentation} homePage={home} updateConfig={updateConfig} addQuestionsPopup={addQuestions}></SetupPage> : null}
      {(appState== AddQuestions) ? <AddQuestionsPopup setupPage={setup} ></AddQuestionsPopup> : null}
    </>
  );
}

export default App;
