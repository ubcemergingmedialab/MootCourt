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

const testlistOfUtterances = ["Hello, nice to meet you.",
"Welcome to Moot Court. Moot court is an online tool designed to help law students practice for the psychologically terrifying mandatory moot court exercise during their first few semesters.", 
"For today’s demo, we have prepared a scenario for you. Listen carefully, and tell us why you agree or disagree with the following new rule.", 
"After consultation with various interest groups, the Provincial Government of BC decided to change the tipping policy for restaurants.", 
"The new policy responds to complaints about the current tipping policy, which include: pressure on customers to tip for service at increasingly high rates (including high-percentage default tipping suggestions when paying using a credit card machine); inappropriate tips by tourists who do not understand tipping customs in the province; and no or low tips for servers despite excellent service.",
"The new policy states that there will be an automatic tip of 12% added to each bill where customers were served food or drinks by a server.", 
"Do you agree or disagree with the new tipping policy? Choose a position: appellant or respondent."]

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
    // Return view, these are regular three.js elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={mesh}
        scale ={hovered ? [3.1, 1.1, 0.5] : [3, 1, 0.5]}
        onClick={(event) => props.presentationPage(props.appConfig, props.appPaused, props.timerWarning)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
      </mesh>
    )
  }
  
  Box.propTypes = {
    /** transitions state machine to be in Setup state */
    presentationPage: PropTypes.func
}

export default function DemoScene({ presentationPage, appConfig, appPaused, timerWarning }) {
    const [animateCamera, setAnimateCamera] = useState(false)
    return (<>
        <Suspense fallback={null}>
            <VRCanvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <DemoJudgeAvatar position={[0, -3, 2]} key={"judge_1"} id={"judge_1"} animated={true} listOfUtterances={testlistOfUtterances}
                        utteranceSplit={0.5 * 60000} randomizeQuestions={false}
                        speaks={true} subtitles={true} appPaused={appPaused} snoozeEnabled={appConfig.delay} shouldWrapUp={timerWarning}/>
                <Box presentationPage={presentationPage} position={[-3.25, 0, 0]} appConfig={appConfig} appPaused={appPaused} timerWarning={timerWarning} />
                    <Box presentationPage={presentationPage} position={[3.25, 0, 0]} />
                    <Text
        position={[-1.375, 0, 3]}
        scale={[2, 2, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
        Appellant
      </Text>
      <Text
        position={[1.375, 0, 3]}
        scale={[2, 2, 0.5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
            Respondent
        </Text>
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
    presentationPage: PropTypes.func,
    /** object passed into scene to from the setup page */
    appConfig: PropTypes.any,
    /** boolean that gets passed to Judge and set by PauseButton. Judge reacts by stopping time counting*/
    appPaused: PropTypes.bool,
    /** boolean that gets passed to Judge and set by Tmer. Judge reacts by making an utterance the the user should wrap up */
    timerWarning: PropTypes.bool
}