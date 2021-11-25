import React, { useEffect } from 'react'
import { useXR } from '@react-three/xr'
import { useControls } from 'leva'
import { useState } from 'react'


import Avatar from './Avatar.js'

import { Canvas, useThree, useLoader } from '@react-three/fiber';
import * as THREE from "three";
import JudgeAvatar from './JudgeAvatar.js'

import { Text } from "troika-three-text";
import WebFont from 'webfontloader';

//import Roboto from "./Roboto_Regular.json"

//Provides subtitles/ text representation for users 


// avatar TextToSay -> utterance changes 
// judge avatar text to say -> utterance changes
// 

const subtitle_default_text = "This is a subtitle object for the judge.";


function Subtitle({ position, textToSay }) {

    const [currentText, setText] = useState("");
 //   const font = new THREE.FontLoader().parse(); // might need to load font files?
 //   const textOptions = {
 //       font,
 //       size: 5,
 //       height: 1
  //  };

  //  const TextDisplay({ updateText }) => {
        // JudgeAvatar.currentText;
        //get.JudgeAvatar.TextToSay
        // everytime judge updates run use effect
 ////       useEffect(() => {
  //          updateSkin(judge)
 //       }, [judge])

    //    return null;
    //}

    // parse JSON file with Three
    const font = new THREE.FontLoader().parse('./fonts/Serat_Ultra_Regular.json');

    // configure font geometry
    const textOptions = {
        font,
        size: 5,
        height: 1
    };



    return (<>
        <mesh>
            <textGeometry attach='geometry' args={['three.js', textOptions]} />
            <meshStandardMaterial attach='material' />
        </mesh>
    </>)
}

export default Subtitle

        //<mesh>
      //      <textGeometry attach='geometry' args={['three.js', textOptions]} />
      //      <meshStandardMaterial attach='material' color="hotpink" />
      //      <mesh rotation={2,2,2} position={position} />
      //  </mesh>

//<TextDisplay updateText={updateText}> </TextDisplay> //might need to adjust brackets