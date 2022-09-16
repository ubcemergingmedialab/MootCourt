import { Suspense, useEffect, useState } from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import { useSpring, animated } from '@react-spring/three'
import JudgeAvatar from './JudgeAvatar'
import Model from './Model'
import Player from './Player'
import '../styles.css'
import PropTypes from 'prop-types'

const testlistOfUtterances = [["Council, you may begin your presentation.", "Would you not agree that being a server in a restaurant is very hard work and that these persons deserve more than the minimum wage they are usually paid by restaurants?",
"Would this policy not be fairer in the sense that the tip would not depend on the particular generosity of the person being served?",
"Does this policy not simplify the whole restaurant experience because the customer is just presented with a final bill they can pay with a quick tap?"], 
["Council, you may begin your presentation.", "Does this new policy take away any incentive of the server to provide excellent service?",
    "We don’t have automatic tips for other types of service work, so why should we have one for restaurants?",
    "Does this policy not penalize servers who go above and beyond in their service and are appropriately given tips in the 20% range?"]]

export default function Scene({ appConfig, appPaused, timerWarning }) {
    const [animateCamera, setAnimateCamera] = useState(false)
    //const props = useSpring({ rotation: animateCamera ? [0, 0, 0] : [0, -Math.PI / 2, 0], config: { duration: 10000 } })
    //const AnimatedPlayer = animated(Player)
    const [config, setConfig] = useState({})
    /*
    useEffect(() => {
        setTimeout(() => {
            console.log('animating camera')
            setAnimateCamera(true)
        }, 1000)
        console.log('app config', appConfig)
    }, [])*/
    useEffect(() => {
        console.log('judge split', window.parseInt(appConfig.questionInterval) * 60000)
        setConfig(appConfig)
    }, [config])
    return (<>
        <Suspense fallback={null}>
            <VRCanvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Hands
                // modelLeft={"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/left-hand-black-webxr-tracking-ready/model.gltf"}
                // modelRight={"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/right-hand-black-webxr-tracking-ready/model.gltf"}
                />
                {
                    //<Avatar position={[-3,-4, -2]} rotation={[0, 0.8, 0]} buttonOffset={[-2, 4, 0]} modelUrl={"./models/testvid_default.glb"}/>
                }
                {config !== {} ? <>

                    <JudgeAvatar position={[0, -2, -4]} key={"judge_1"} id={"judge_1"} animated={true} listOfUtterances={Object.keys(appConfig["questionsList"]).length > 0? Object.values(appConfig.questionsList) : testlistOfUtterances[appConfig.position]}
                        utteranceSplit={window.parseInt(config.questionInterval) * 60000} randomizeQuestions={config.random}
                        speaks={true} subtitles={appConfig.closedCaption} appPaused={appPaused} snoozeEnabled={appConfig.delay} shouldWrapUp={timerWarning}/>

                    {/*<JudgeAvatar position={[-2, -2, -4]} key={"judge_0"} id={"judge_0"} utteranceSplit={180000} animated={false} speaks={false} />
                    <JudgeAvatar position={[2, -2, -4]} key={"judge_2"} id={"judge_2"} utteranceSplit={180000} animated={false} speaks={false} />*/}</> : null}
                <Model modelUrl="./models/courtroompropsNov17.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomwallsJan25.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <Model modelUrl="./models/courtroomdesksNov17.glb"
                    pos={[0, -3, 3.5]}
                    rot={[0, 0, 0]}
                    sca={[0.06, 0.06, 0.06]} />
                <DefaultXRControllers />
                </VRCanvas></Suspense></>)
}

Scene.propTypes = {
    /** object passed into scene to from the setup page */
    appConfig: PropTypes.any,
    /** boolean that gets passed to Judge and set by PauseButton. Judge reacts by stopping time counting*/
    appPaused: PropTypes.bool,
    /** boolean that gets passed to Judge and set by Tmer. Judge reacts by making an utterance the the user should wrap up */
    timerWarning: PropTypes.bool
}