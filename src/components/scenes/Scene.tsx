// import {useState, useEffect} from 'react';
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
// import Model from '../general/Model.js';
// import {Html, PerspectiveCamera, useTexture} from "@react-three/drei"
// import { Vector3 } from 'three'; // Import Vector3 from three.js

// import GlobalTimer from '../general/GlobalTimer';
// import PauseButton from '../buttons/PauseButton';
// import SceneJudgeAvatar from '../avatars/SceneJudgeAvatar';
// import BackToLandingButton from '../buttons/BackToLandingButton';
// import JudgeTimedSpeech from '../general/JudgeTimedSpeech';
// import '../ui/Captions.css';
// import ConverseAttach from '../general/Converse';
// import PausedMenu from '../ui/PausedMenu';
// import AssessmentPage from '../ui/AssessmentPage';



// const cameraPosition = new Vector3(0, 0, 5); // [x, y, z] coordinates of the camera
// const cameraFov = 48; // Field of view in degrees

// export default function GeneralScene({setPaused, appConfig, appPaused, togglePause, updateAppState, updateConfig}) {
//     // Scene Specific Elements are stored here
//     // 1: Text that judge is supposed to say at given interval
//     const [judgeSpeechText, setJudgeSpeechText] = useState("Default speech text for judge.")
//     // 2: Time elapsed since the start of the interval. Resets if the user delays speech.
//     // Moves onto next question when elapsed time equals the config interval
//     const [judgeElapsedTime, setJudgeElapsedTime] = useState(0)
//     // 3: Stores the current global time of the scene since the beginning.
//     // Starting value: config's total time (in seconds) converted to ms
//     // add 5 second delay
//     const [currentTime, setCurrentTime] = useState(appConfig.totalTime * 1000 + appConfig.introductionTime * 1000 + 5000)
//     // 4: Track whether the judge interval should be updated or not.
//     const [shouldUpdateJudgeElapsedTime, setShouldUpdateJudgeElapsedTime] = useState(false);
//     // 5: Is the speech in intro mode?
//     const [isAppInIntro, setIsAppInIntro] = useState(false);
//     // 6: Has intro speech been started?
//     const [hasAppIntroStarted, setHasAppIntroStarted] = useState(false);

//     return (<Canvas
//         camera={{
//             position: cameraPosition,
//             fov: cameraFov,
            
//         }}
        
//         style={{
//             backgroundImage: `url("textures/judge_courtroom.png")`, // Replace with your background image path
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             height: '100%', // Make sure the canvas takes the full height of its container

//           }}>
//                 <ambientLight intensity={0.2}/>
//                 <rectAreaLight
//                     intensity={2}
//                     position={[0, 0, 10]}
//                     width={10}
//                     height={10}
//                     color="white"
//                 />

//                 <spotLight
//                     position={[-7, 5, 0]} // Adjust the position of the light
//                     angle={Math.PI / 5}
//                     penumbra={1} // Smoothness of the spotlight edge
//                     intensity={1} // Adjust the intensity of the light (default is 1)
//                     color="white" // Adjust the color of the light
//                     distance={50} // Maximum distance the light will shine
//                 />

//                 <spotLight
//                     position={[0, -7, 20]} // Adjust the position of the light
//                     angle={Math.PI / 5}
//                     penumbra={.5} // Smoothness of the spotlight edge
//                     intensity={1} // Adjust the intensity of the light (default is 1)
//                     color="white" // Adjust the color of the light
//                     distance={70} // Maximum distance the light will shine
//                 />

//                 {/* <JudgeTimedSpeech
//                 config={appConfig}
//                 judgeElapsedTime={judgeElapsedTime}
//                 setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
//                 setJudgeSpeechText={setJudgeSpeechText}></JudgeTimedSpeech> */}
//                 <SceneJudgeAvatar appPaused={appPaused} judgeSpeechText={judgeSpeechText} config={appConfig}></SceneJudgeAvatar>
//                 {/* <Model modelUrl="./models/courtroom_props_updated.glb"
//                     pos={[0, -3, 3]}
//                     rot={[0, 0, 0]}
//                     sca={[0.06, 0.06, 0.06]} />
//                 <Model modelUrl="./models/courtroom_walls_updated.glb"
//                     pos={[0, -3, 3.5]}
//                     rot={[0, 0, 0]}
//                     sca={[0.06, 0.06, 0.06]} /> */}
//                 <Model modelUrl="./models/courtroom_tables_updated_01.glb"
//                     pos={[0, -3.25, 4.5]} 
//                     rot={[0, 0, 0]}
//                     sca={[0.055, 0.055, 0.055]} />

//                 <Html fullscreen>
//                 <div className="scene-controls">
//                     <div className="scene-controls-inner">
//                         <BackToLandingButton updateAppState={updateAppState} setPaused={setPaused} updateConfig={updateConfig}></BackToLandingButton>
//                         <PauseButton togglePause={togglePause}></PauseButton>
//                         <GlobalTimer
//                         hasAppIntroStarted={hasAppIntroStarted}
//                         setHasAppIntroStarted={setHasAppIntroStarted}
//                         isAppInIntro={isAppInIntro}
//                         setIsAppInIntro={setIsAppInIntro}
//                         setJudgeSpeechText={setJudgeSpeechText}
//                         config={appConfig}
//                         appPaused={appPaused}
//                         updateAppState={updateAppState}
//                         currentTime={currentTime}
//                         setCurrentTime={setCurrentTime}
//                         noNegativeTime={appConfig.stopPresentation}
//                         judgeElapsedTime={judgeElapsedTime}
//                         setJudgeElapsedTime={setJudgeElapsedTime}
//                         setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
//                         shouldUpdateJudgeElapsedTime={shouldUpdateJudgeElapsedTime}></GlobalTimer>
//                     </div>

//                     <AssessmentPage></AssessmentPage>
//                     <ConverseAttach></ConverseAttach>
//                     <PausedMenu appPaused={appPaused} 
//                     togglePause={setPaused}>
//                     </PausedMenu>
                    
//                 </div>
//                 </Html>
//             </Canvas>
//     )
// }

import {useState, useEffect} from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import Model from '../general/Model.js';
import GlobalTimer from '../general/GlobalTimer';
import PauseButton from '../buttons/PauseButton';
import SceneJudgeAvatar from '../avatars/SceneJudgeAvatar';
import BackToLandingButton from '../buttons/BackToLandingButton';
import JudgeTimedSpeech from '../general/JudgeTimedSpeech';
import '../ui/Captions.css';
import ConverseAttach from '../general/Converse';
import PausedMenu from '../ui/PausedMenu';
import AssessmentPage from '../ui/AssessmentPage';
import React, { useRef } from 'react';

import '../ui/Captions.css';
import './GeneralScene.css'; // Import your custom CSS file

import {Html, PerspectiveCamera, useTexture} from "@react-three/drei"
import { Vector3 } from 'three'; // Import Vector3 from three.js

const cameraPosition = new Vector3(0, 0, 5);
const cameraFov = 48;

export default function GeneralScene({ setPaused, appConfig, appPaused, togglePause, updateAppState, updateConfig }) {
    // Scene Specific Elements are stored here
    // 1: Text that judge is supposed to say at given interval
    const [judgeSpeechText, setJudgeSpeechText] = useState("Default speech text for judge.")
    // 2: Time elapsed since the start of the interval. Resets if the user delays speech.
    // Moves onto next question when elapsed time equals the config interval
    const [judgeElapsedTime, setJudgeElapsedTime] = useState(0)
    // 3: Stores the current global time of the scene since the beginning.
    // Starting value: config's total time (in seconds) converted to ms
    // add 5 second delay
    const [currentTime, setCurrentTime] = useState(appConfig.totalTime * 1000 + appConfig.introductionTime * 1000 + 5000)
    // 4: Track whether the judge interval should be updated or not.
    const [shouldUpdateJudgeElapsedTime, setShouldUpdateJudgeElapsedTime] = useState(false);
    // 5: Is the speech in intro mode?
    const [isAppInIntro, setIsAppInIntro] = useState(false);
    // 6: Has intro speech been started?
    const [hasAppIntroStarted, setHasAppIntroStarted] = useState(false);

    const displayConversation = useRef<React.ReactElement[]>([]);

    const [conversationElements, setConversationElements] = useState<React.ReactElement[]>([]);

  // Extract the conversation elements from displayConversation useRef and update the state
        useEffect(() => {
            setConversationElements(displayConversation.current);
        }, [displayConversation.current]);
            
    return (
        <div className="canvas-container" style={{ backgroundImage: 'url("textures/judge_courtroom.png")' }}>
            <Canvas
                camera={{
                    position: cameraPosition,
                    fov: cameraFov,
                }}


                className="canvas"
            >
                 <ambientLight intensity={0.2}/>
                 <rectAreaLight
                    intensity={2}
                    position={[0, 0, 10]}
                    width={10}
                    height={10}
                    color="white"
                />

                <spotLight
                    position={[-7, 5, 0]} // Adjust the position of the light
                    angle={Math.PI / 5}
                    penumbra={1} // Smoothness of the spotlight edge
                    intensity={1} // Adjust the intensity of the light (default is 1)
                    color="white" // Adjust the color of the light
                    distance={50} // Maximum distance the light will shine
                />

                <spotLight
                    position={[0, -7, 20]} // Adjust the position of the light
                    angle={Math.PI / 5}
                    penumbra={.5} // Smoothness of the spotlight edge
                    intensity={1} // Adjust the intensity of the light (default is 1)
                    color="white" // Adjust the color of the light
                    distance={70} // Maximum distance the light will shine
                />

                {/* <JudgeTimedSpeech
                config={appConfig}
                judgeElapsedTime={judgeElapsedTime}
                setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
                setJudgeSpeechText={setJudgeSpeechText}></JudgeTimedSpeech> */}
                <SceneJudgeAvatar appPaused={appPaused} judgeSpeechText={judgeSpeechText} config={appConfig}></SceneJudgeAvatar>
                {/* <Model modelUrl="./models/courtroom_props_updated.glb"
                    pos={[0, -3, 3]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroom_walls_updated.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} /> */}
                <Model modelUrl="./models/courtroom_tables_updated_01.glb"
                    pos={[0, -3.25, 4.5]} 
                    rot={[0, 0, 0]}
                    sca={[0.055, 0.055, 0.055]} />
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
                    togglePause={setPaused}>

                    

                        
                    </PausedMenu>
                    
                </div>
                </Html>
            </Canvas>
        </div>
    )
}
