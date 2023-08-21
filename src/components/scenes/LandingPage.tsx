// import * as THREE from 'three'
// import React, {useRef, useState } from 'react'
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import Model from '../general/Model.js'
// import {Html, PerspectiveCamera, useTexture} from "@react-three/drei"
// import LandingPageJudgeAvatar from '../avatars/LandingPageJudgeAvatar'
// import LandingPageMenu from '../ui/LandingPageMenu'
// import { Vector3 } from 'three'; // Import Vector3 from three.js

// import { PlaneGeometry, MeshBasicMaterial, Mesh, TextureLoader } from 'three';


// let appPaused = false

// const lou = []

// const cameraPosition = new Vector3(0, 0, 5); // [x, y, z] coordinates of the camera
// const cameraFov = 75; // Field of view in degrees


// export default function LandingPage({updateAppState, updateConfig, config}) {
//     return (<Canvas
//                 camera={{
//                     position: cameraPosition,
//                     fov: cameraFov,
//                 }}>
//                 <ambientLight intensity={0.3}/>

//                 <rectAreaLight
//                         intensity={0.3}
//                         position={[0, 0, 10]}
//                         width={30}
//                         height={20}
//                         color="white"
//                     />

//                 <pointLight
//                     position={[-6, 4, -2]} // Adjust the position of the light
//                     intensity={2} // Adjust the intensity of the light (default is 1)
//                     color="white" // Adjust the color of the light
//                     distance={12} // Maximum distance the light will shine
//                     decay={5}
//                 />
//                 <pointLight
//                     position={[0, 4, -2]} // Adjust the position of the light
//                     intensity={1.5} // Adjust the intensity of the light (default is 1)
//                     color="white" // Adjust the color of the light
//                     distance={15} // Maximum distance the light will shine
//                     decay={3}
//                 />

//                 <spotLight
//                     position={[0, 5, 10]} // Adjust the position of the light
//                     angle={Math.PI / 8}
//                     penumbra={1} // Smoothness of the spotlight edge
//                     intensity={1.5} // Adjust the intensity of the light (default is 1)
//                     color="white" // Adjust the color of the light
//                     distance={100} // Maximum distance the light will shine
                    
//                 />

//                 <LandingPageJudgeAvatar listOfUtterances={lou}></LandingPageJudgeAvatar>
//                 {/* <Model modelUrl="./models/courtroom_props_updated.glb"
//                     pos={[0, -3, 3]}
//                     rot={[0, 0, 0]}
//                     sca={[0.06, 0.06, 0.06]} />
//                 <Model modelUrl="./models/courtroom_walls_updated.glb"
//                     pos={[0, -3, 3.5]}
//                     rot={[0, 0, 0]}
//                     sca={[0.06, 0.06, 0.06]} />
                // <Model modelUrl="./models/courtroom_tables_updated_landing.glb"
                //     pos={[0, -3.25, 4.5]} 
                //     rot={[0, 0, 0]}
                //     sca={[0.055, 0.055, 0.055]} /> */}

//         <Html fullscreen>
//             <LandingPageMenu updateAppState={updateAppState} updateConfig={updateConfig} config={config} ></LandingPageMenu>
//         </Html>
//         </Canvas>
//     );
// }


import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, PerspectiveCamera, useTexture } from '@react-three/drei';
import LandingPageJudgeAvatar from '../avatars/LandingPageJudgeAvatar';
import LandingPageMenu from '../ui/LandingPageMenu';
import { Vector3 } from 'three';
import * as THREE from 'three';


let appPaused = false;

const lou = [];

const cameraPosition = new Vector3(0, 0, 5);
const cameraFov = 75;

    
const targetObjectback = new THREE.Object3D();
// Set the position of the targetObject
targetObjectback.position.set(0, 0, -8);

export default function LandingPage({ updateAppState, updateConfig, config }) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: cameraFov }}
        // style={{
        //   backgroundImage: `url("textures/courtroom.png")`, // Replace with your background image path
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   width: '100%', // Make sure the canvas takes the full width of its container
        //   height: '100%', // Make sure the canvas takes the full height of its container

      // }}
    >

      
<ambientLight intensity={0.4} />
<rectAreaLight intensity={0.5} position={[0, 0, 10]} width={30} height={20} color="white" />


<primitive object={targetObjectback}/>
<spotLight //focus light towards the judge
    position={[0, .5, -7.5]} // Adjust the position of the light
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
        <LandingPageMenu updateAppState={updateAppState} updateConfig={updateConfig} config={config} />
      </Html>
    </Canvas>
  );
}
