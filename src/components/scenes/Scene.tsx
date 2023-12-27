import {useState, useEffect} from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import Model from '../general/Model.js';
import GlobalTimer from '../general/GlobalTimer';
import PauseButton from '../buttons/PauseButton';
import SceneJudgeAvatar from '../avatars/SceneJudgeAvatar';
import BackToLandingButton from '../buttons/BackToLandingButton';
import JudgeTimedSpeech from '../general/JudgeTimedSpeech';
import '../ui/Captions.css';
import PausedMenu from '../ui/PausedMenu';
import AssessmentPage from '../ui/AssessmentPage';
import React, { useRef } from 'react';

import '../ui/Captions.css';
import './GeneralScene.css'; // Import your custom CSS file

import {Html, PerspectiveCamera, useTexture} from "@react-three/drei"
import { Vector3 } from 'three'; // Import Vector3 from three.js
import * as THREE from 'three';

const cameraPosition = new Vector3(0, 0, 5);
const cameraFov = 48;

export default function GeneralScene({ setPaused, appConfig, appPaused, togglePause, updateAppState, updateConfig, judgeElapsedTime, setJudgeElapsedTime}) {
    // Scene Specific Elements are stored here
    // Text that judge is supposed to say at given interval
    const [judgeSpeechText, setJudgeSpeechText] = useState("Default speech text for judge.")

    // Stores the current global time of the scene since the beginning.
    // Starting value: config's total time (in seconds) converted to ms
    // add 5 second delay
    const [currentTime, setCurrentTime] = useState(appConfig.totalTime * 1000 + appConfig.introductionTime * 1000 + 5000)
    // Track whether the judge interval should be updated or not.
    const [shouldUpdateJudgeElapsedTime, setShouldUpdateJudgeElapsedTime] = useState(false);
    // Is the speech in intro mode?
    const [isAppInIntro, setIsAppInIntro] = useState(false);
    // Has intro speech been started?
    const [hasAppIntroStarted, setHasAppIntroStarted] = useState(false);

    const displayConversation = useRef<React.ReactElement[]>([]);

    const [conversationElements, setConversationElements] = useState<React.ReactElement[]>([]);
    
    const targetObjectback = new THREE.Object3D();
    // Set the position of the targetObject
    targetObjectback.position.set(0, 0, -8);
    


    const targetObjectSun = new THREE.Object3D();
    // Set the position of the targetObject
    targetObjectSun.position.set(10, 0, -5);

  // Extract the conversation elements from displayConversation useRef and update the state
        useEffect(() => {
            setConversationElements(displayConversation.current);
        }, [displayConversation.current]);
            
    return (
            <Canvas
                camera={{
                    position: cameraPosition,
                    fov: cameraFov,
                }}
                
            // style={{
            //   backgroundImage: 'url("textures/judge_courtroom.png")', // Replace with your background image path
            //   backgroundSize: 'cover',
            //   backgroundPosition: 'center',
            //   width: '100%', // Make sure the canvas takes the full width of its container
            //   height: '100%', // Make sure the canvas takes the full height of its container
             // }}
                >

            <ambientLight intensity={0.4} />

            <rectAreaLight intensity={0.5} position={[0, 0, 10]} width={30} height={20} color="white" />

            <pointLight //playerstation
                position={[0, 2, 4]} // Adjust the position of the point light
                intensity={40} // Adjust the intensity of the light
                color="white" // Set the light color using the 0xRRGGBB format
                distance={6}
                decay={1.5} 
            /> 
            <primitive object={targetObjectback}/>
            <spotLight //focus light towards the judge
                position={[0, 0, -7.5]} // Adjust the position of the light
                angle={Math.PI /3}
                penumbra={1} // Smoothness of the spotlight edge
                intensity={2} // Adjust the intensity of the light (default is 1)
                color={0xebd8b9} // Adjust the color of the light
                distance={7} // Maximum distance the light will shine
                target={targetObjectback}
            />

            <primitive object={targetObjectSun}/>
            <spotLight //window sunlgiht
                position={[-9, 1, 1]} // Adjust the position of the light
                angle={Math.PI / 7}
                penumbra={0.5} // Smoothness of the spotlight edge
                intensity={5} // Adjust the intensity of the light (default is 1)
                color={0xebd8b9} // Adjust the color of the light
                distance={25} // Maximum distance the light will shine
                target={targetObjectSun}

            />
            <pointLight //window source light
                position={[-9, 0.8, -4.5]} // Adjust the position of the point light
                intensity={70} // Adjust the intensity of the light
                color={0xebd8b9} // Set the light color using the 0xRRGGBB format
                distance={10}
                decay={6} 
            />

                {/* <JudgeTimedSpeech
                config={appConfig}
                judgeElapsedTime={judgeElapsedTime}
                setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
                setJudgeSpeechText={setJudgeSpeechText}></JudgeTimedSpeech> */}
                <Model modelUrl="./models/courtroom_walls.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroom_tables_updated_03.glb"
                    pos={[0, -3.25, 4.5]} 
                    rot={[0, 0, 0]}
                    sca={[0.055, 0.055, 0.055]} />
                <Model modelUrl="./models/courtroom_props_updated.glb"
                    pos={[0, -3, 3]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <SceneJudgeAvatar
                    appPaused={appPaused}
                    judgeSpeechText={judgeSpeechText}
                    judgeElapsedTime = {judgeElapsedTime}
                    config={appConfig}
                    updateConfig={updateConfig}/>

                {/* Wrap all the HTML components here */}

                <Html fullscreen>
                <div className="scene-controls">
                    <div className="scene-controls-inner">
                        <BackToLandingButton updateAppState={updateAppState} setPaused={setPaused} updateConfig={updateConfig}></BackToLandingButton>
                        <PauseButton togglePause={togglePause}></PauseButton>
                        <GlobalTimer
                        hasAppIntroStarted={hasAppIntroStarted}
                        setHasAppIntroStarted={setHasAppIntroStarted}
                        isAppInIntro={isAppInIntro}
                        setIsAppInIntro={setIsAppInIntro}
                        setJudgeSpeechText={setJudgeSpeechText}
                        config={appConfig}
                        appPaused={appPaused}
                        updateAppState={updateAppState}
                        currentTime={currentTime}
                        setCurrentTime={setCurrentTime}
                        noNegativeTime={appConfig.stopPresentation}
                        judgeElapsedTime={judgeElapsedTime}
                        setJudgeElapsedTime={setJudgeElapsedTime}
                        setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
                        shouldUpdateJudgeElapsedTime={shouldUpdateJudgeElapsedTime}></GlobalTimer>
                    </div>

                    <PausedMenu updateAppState={updateAppState}
                    appPaused={appPaused}
                    togglePause={togglePause}
                    config={appConfig}
                    children={undefined}>
                    </PausedMenu>
                    
                </div>
                </Html>
            </Canvas>

    )
}
