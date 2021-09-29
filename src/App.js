import React, { useRef, useState } from 'react'
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
import { Box, Stage } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useHover } from 'react-use-gesture'
import * as THREE from 'three'
import './styles.css'

import Button from './Components/Button.js'
import Model from './Components/Model.js'
import LipSync from './Components/LipSync.js'

function PlayerExample() {
  const { player } = useXR()

  useFrame(() => {
    player.rotation.x = player.rotation.y += 0.01
  })

  return null
}

function HitTestExample() {
  const ref = useRef()

  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  return <Box ref={ref} args={[0.1, 0.1, 0.1]} />
}

function App() {
  const [micStarted, startMic] = useState(false)
  const [blendShape, setBlendShape] = useState([0, 0, 0])
  return (
    <VRCanvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Hands
      // modelLeft={"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/left-hand-black-webxr-tracking-ready/model.gltf"}
      // modelRight={"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/right-hand-black-webxr-tracking-ready/model.gltf"}
      />

      <Model modelUrl="./models/courtroom.glb"
        pos={[0, -4, -2]}
        rot={[-1.57, 0, 1.57]} />
      <Button clickHandler={() => !micStarted? startMic(true): null}
        position={[0, 0, 4]}
        scale={[1 + blendShape[1] * 5, 1 + blendShape[0] * 5, 1 + blendShape[2] * 5]} 
        rotation={[0.5, 0.5, 0]}/>
      {micStarted ? <LipSync blendShapeHandler={(shapes) => setBlendShape([shapes.BlendShapeMouth, shapes.BlendShapeLips, shapes.BlendShapeKiss])} /> : null}
      <DefaultXRControllers />
    </VRCanvas>
  );
}

export default App;
