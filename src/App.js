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
import { useFrame, useThree, extend } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './styles.css'

import Model from './Components/Model.js'
import Avatar from './Components/Avatar.js'
import Compass from './Components/Compass.js'
import JudgeAvatar from './Components/JudgeAvatar.js'
import Player from './Components/Player.js'
import SettingsPage from './Components/SettingsPage'

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
  const [presentationStarted, setPresentationStarted] = useState(false)
  const [settingsPageActive, setSettingsPageActive] = useState(false)
  const hideSettingsPage = function () {
    setSettingsPageActive(false)
  }
  return (
    <>
      {presentationStarted ?
        <VRCanvas>
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
          <JudgeAvatar position={[-2, -2, -4]}  utteranceSplit={180000} />
          
          <JudgeAvatar position={[0, -2, -4]}  utteranceSplit={180000} />
          
          <JudgeAvatar position={[2, -2, -4]}  utteranceSplit={180000} />
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
        </VRCanvas> : <>
          <button type="button" onClick={() => { setPresentationStarted(true) }}>Start Experience</button>
          <button type="button" onClick={() => { setSettingsPageActive(true) }}>Settings Page</button>
          {settingsPageActive ? <SettingsPage hideSettingsPage={hideSettingsPage}></SettingsPage> : null}</>}
    </>
  );
}

export default App;
