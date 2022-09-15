import { Suspense, useEffect, useState, useRef } from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import { useSpring, animated } from '@react-spring/three'
import Model from './Model'
import Player from './Player'
import '../styles.css'
import PropTypes from 'prop-types'
import DemoJudgeAvatar from './DemoJudgeAvatar'
import './setupStyles.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stats, Text } from "@react-three/drei";

// const testlistOfUtterances = ["Moot court is an online tool designed to help law students practice for the psychologically terrifying mandatory moot court exercise during their first few semesters. For today’s demo, we have prepared a scenario for you. Listen carefully, and tell us why you agree or disagree with the following new rule. The provincial government, after receiving advice from a number of interested groups, decided to change tipping policy in British Columbia. Complaints about the current policy included: customers feeling pressured to tip at increasingly high rates (including through high percentage “options” provided to them in card machines), tourists not understanding tipping customs in the province; and, some servers being provided little or no tip despite excellent service. The government decided that the new policy is that there would be an automatic tip of 12% provided to each bill where customers were served food or drinks by a server. Do you agree or disagree with the new tipping policy? Choose a position: appellant or respondent."]

const testlistOfUtterances = ["", 
"Moot court is an online tool designed to help law students practice for the psychologically terrifying mandatory moot court exercise during their first few semesters.", 
"For today’s demo, we have prepared a scenario for you. Listen carefully, and tell us why you agree or disagree with the following new rule.", 
"The provincial government, after receiving advice from a number of interested groups, decided to change tipping policy in British Columbia.", 
"Complaints about the current policy included: customers feeling pressured to tip at increasingly high rates (including through high percentage “options” provided to them in card machines), tourists not understanding tipping customs in the province; and, some servers being provided little or no tip despite excellent service.", 
"The government decided that the new policy is that there would be an automatic tip of 12% provided to each bill where customers were served food or drinks by a server.", 
"Do you agree or disagree with the new tipping policy? Choose a position: appellant or respondent."]

export default function DemoScene({ appConfig, appPaused, timerWarning }) {
    const [animateCamera, setAnimateCamera] = useState(false)
    return (<>
        <Suspense fallback={null}>
            <VRCanvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <DemoJudgeAvatar position={[0, -3, 2]} key={"judge_1"} id={"judge_1"} animated={true} listOfUtterances={testlistOfUtterances}
                        utteranceSplit={0.5 * 60000} randomizeQuestions={false}
                        speaks={true} subtitles={true} appPaused={appPaused} snoozeEnabled={appConfig.delay} shouldWrapUp={timerWarning}/>
                <Model modelUrl="./models/courtroompropsNov17.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomwallsJan25.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
        <DefaultXRControllers />
        </VRCanvas></Suspense></>)
}

DemoScene.propTypes = {
    /** object passed into scene to from the setup page */
    appConfig: PropTypes.any,
    /** boolean that gets passed to Judge and set by PauseButton. Judge reacts by stopping time counting*/
    appPaused: PropTypes.bool,
    /** boolean that gets passed to Judge and set by Tmer. Judge reacts by making an utterance the the user should wrap up */
    timerWarning: PropTypes.bool
}