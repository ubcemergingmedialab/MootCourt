import {useState, useEffect} from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import Model from '../general/Model.js'
import {Html} from "@react-three/drei";
import GlobalTimer from '../general/GlobalTimer'
import PauseButton from '../buttons/PauseButton'
import SceneJudgeAvatar from '../avatars/SceneJudgeAvatar'
import BackToLandingButton from '../buttons/BackToLandingButton';
import JudgeTimedSpeech from '../general/JudgeTimedSpeech';
import Captions from '../general/Captions';
import '../ui/Captions.css';
import SpeechAnalytics from '../general/SpeechAnalytics';
import Dictaphone from '../general/Dictaphone.jsx';
import ChatGPTAttach from '../general/ChatGPTAttach.js';

// Handle pause detected logic
const DictaphonePauseDetected = () => {
    console.log("DictaphonePauseDetected");
};

export default function GeneralScene({setPaused, appConfig, appPaused, togglePause, updateAppState, updateConfig}) {
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



    return (<Canvas>
                <ambientLight intensity={0.5}/>
                <pointLight position={[10, 0, 10]} />
                {/* <JudgeTimedSpeech
                config={appConfig}
                judgeElapsedTime={judgeElapsedTime}
                setShouldUpdateJudgeElapsedTime={setShouldUpdateJudgeElapsedTime}
                setJudgeSpeechText={setJudgeSpeechText}></JudgeTimedSpeech> */}
                <SceneJudgeAvatar appPaused={appPaused} judgeSpeechText={judgeSpeechText}></SceneJudgeAvatar>
                <Model modelUrl="./models/courtroompropsNov17.glb"
                    pos={[0, -3, 3]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomwallsJan25.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomdesksNov17.glb"
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

                    <div className="captions-container">
                        <Captions></Captions>
                    </div>

                    <Dictaphone handlePauseDetected={DictaphonePauseDetected}></Dictaphone>
                    <SpeechAnalytics></SpeechAnalytics>
                    <ChatGPTAttach></ChatGPTAttach>
                    
                </div>
                </Html>
            </Canvas>
    )
}
