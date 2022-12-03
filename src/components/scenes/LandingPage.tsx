import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import Model from '../general/Model.js'
import {Html, useTexture} from "@react-three/drei";
import LandingPageJudgeAvatar from '../avatars/LandingPageJudgeAvatar'
import BackToSceneButton from '../buttons/BackToSceneButton'

let appPaused = false

const testlistOfUtterances = ["Hello, nice to meet you.",
"Welcome to Moot Court. Moot court is an online tool designed to help law students practice for the psychologically terrifying mandatory moot court exercise during their first few semesters.", 
"For today’s demo, we have prepared a scenario for you. Listen carefully, and tell us why you agree or disagree with the following new rule.", 
"After consultation with various interest groups, the Provincial Government of BC decided to change the tipping policy for restaurants.", 
"The new policy responds to complaints about the current tipping policy, which include: pressure on customers to tip for service at increasingly high rates (including high-percentage default tipping suggestions when paying using a credit card machine); inappropriate tips by tourists who do not understand tipping customs in the province; and no or low tips for servers despite excellent service.",
"The new policy states that there will be an automatic tip of 12% added to each bill where customers were served food or drinks by a server.", 
"Do you agree or disagree with the new tipping policy? Choose a position: appellant or respondent."]


function AllardLogoPlane(props:any) {
  const AllardLogo = useTexture({
    map: './textures/PALSOL-1.2b-Primary-UBC-Shield.png',
  })
  const mesh = useRef()
  return (
    <mesh
      {...props}
      ref={mesh}
      >
      <planeGeometry args={[4.18974359, 0.975, 1]} />
      <meshStandardMaterial {...AllardLogo} transparent={true} />
    </mesh>
  )
}

function EMLLogoPlane(props:any) {
  const EMLLogo = useTexture({
    map: './textures/UBC_Alternate_reverse_white.png',
  })
  const mesh = useRef()
  return (
    <mesh
      {...props}
      ref={mesh}
      >
      <planeGeometry args={[4.459, 0.752, 1]} />
      <meshStandardMaterial {...EMLLogo} transparent={true} color={'#102444'}/>
    </mesh>
  )
}

export default function LandingPage({updateAppState, updateConfig}) {
    return (<Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <LandingPageJudgeAvatar listOfUtterances={testlistOfUtterances}></LandingPageJudgeAvatar>
                <Model modelUrl="./models/courtroompropsNov17.glb"
                    pos={[0, -3, 3]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomwallsJan25.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Html fullscreen>
                  <BackToSceneButton updateAppState={updateAppState}></BackToSceneButton>
                  <button onClick={() => {updateConfig({})}}>Update Config</button>
                </Html>
            </Canvas>
    )
}