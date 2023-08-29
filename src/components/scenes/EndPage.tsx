import * as THREE from 'three'
import React, {useRef, useState } from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import Model from '../general/Model.js'
import {Html, useTexture} from "@react-three/drei"
import LandingPageJudgeAvatar from '../avatars/LandingPageJudgeAvatar'
import LandingPageMenu from '../ui/LandingPageMenu'
import EndPageMenu from '../ui/EndPageMenu'

let appPaused = false

const lou = []
const targetObjectback = new THREE.Object3D();
// Set the position of the targetObject
targetObjectback.position.set(0, 0, -8);

export default function EndPage({updateAppState, updateConfig, config}) {
    return (<Canvas>
<ambientLight intensity={0.4} />

<rectAreaLight intensity={0.5} position={[0, 0, 10]} width={30} height={20} color="white" />


<primitive object={targetObjectback}/>
<spotLight //focus light towards the judge
    position={[0, 0.5, -7.5]} // Adjust the position of the light
    angle={Math.PI /2}
    penumbra={1} // Smoothness of the spotlight edge
    intensity={3} // Adjust the intensity of the light (default is 1)
    color={0xebd8b9} // Adjust the color of the light
    distance={8} // Maximum distance the light will shine
    target={targetObjectback}
/>
{/* <spotLight //window sunlgiht classroom 
    position={[-9, 0, 2]} // Adjust the position of the light
    angle={Math.PI / 7}
    penumbra={0.5} // Smoothness of the spotlight edge
    intensity={9} // Adjust the intensity of the light (default is 1)
    color={0xebd8b9} // Adjust the color of the light
    distance={25} // Maximum distance the light will shine
/>
<pointLight //window source light classroom
    position={[0, 0, 6]} // Adjust the position of the point light
    intensity={40} // Adjust the intensity of the light
    color={0xebd8b9} // Set the light color using the 0xRRGGBB format
    distance={9}
    decay={8} 
/>

<pointLight //window source light 1 classroom
    position={[-9, 0.9, -3.2]} // Adjust the position of the point light
    intensity={50} // Adjust the intensity of the light
    color={0xebd8b9} // Set the light color using the 0xRRGGBB format
    distance={5}
    decay={8} 
/>
<pointLight //window source light 2 classroom
    position={[-9, 0.9, -5]} // Adjust the position of the point light
    intensity={50} // Adjust the intensity of the light
    color={0xebd8b9} // Set the light color using the 0xRRGGBB format
    distance={6}
    decay={8} 
/> */}


<spotLight //window sunlgiht courtroom 
    position={[-9, 0, 2]} // Adjust the position of the light
    angle={Math.PI / 7}
    penumbra={0.5} // Smoothness of the spotlight edge
    intensity={9} // Adjust the intensity of the light (default is 1)
    color={0xebd8b9} // Adjust the color of the light
    distance={25} // Maximum distance the light will shine
/>

<pointLight //window source light courtroom
    position={[0, 0, 6]} // Adjust the position of the point light
    intensity={40} // Adjust the intensity of the light
    color={0xebd8b9} // Set the light color using the 0xRRGGBB format
    distance={9}
    decay={8} 
/>

<pointLight //window source light 1 courtroom
    position={[-11, 1.5, -3]} // Adjust the position of the point light
    intensity={20} // Adjust the intensity of the light
    color={0xebd8b9} // Set the light color using the 0xRRGGBB format
    distance={10}
    decay={8} 
/>
<pointLight //window source light 2 courtroom
    position={[-11, 1.5, -4.5]} // Adjust the position of the point light
    intensity={20} // Adjust the intensity of the light
    color={0xebd8b9} // Set the light color using the 0xRRGGBB format
    distance={18}
    decay={8} 
/>
      <Model modelUrl="./models/courtroom_walls.glb"
            pos={[0, -3, 3.5]}
            rot={[0, 0, 0]}
            sca={[0.06, 0.06, 0.06]} />
      <Model modelUrl="./models/courtroom_tables_updated_landing.glb"
          pos={[0, -3.25, 4.5]} 
          rot={[0, 0, 0]}
          sca={[0.055, 0.055, 0.055]} />
      <Model modelUrl="./models/courtroom_props_updated.glb"
          pos={[0, -3, 3]}
          rot={[0, 0, 0]}
          sca={[0.06, 0.06, 0.06]} />
        <LandingPageJudgeAvatar listOfUtterances={lou} />

        <Html fullscreen>
            <EndPageMenu updateAppState={updateAppState} updateConfig={updateConfig} config={config} ></EndPageMenu>
        </Html>
        </Canvas>
    )
}