import { Suspense, useEffect, useState } from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import { useSpring, animated } from '@react-spring/three'
import JudgeAvatar from './JudgeAvatar'
import Model from './Model'
import Player from './Player'
import '../styles.css'

const testlistOfUtterances = [[
    "Did not the trial court make some findings of fact that are contrary to your submissions, and should we not defer to those findings of fact?",
    "Should not we presume that the trial judge knows the law and applied the correct law?",
    "Are not some of the facts of the cases you rely upon very different from the facts of this case?",
    "Could you please tell the Court exactly where you are in your Factum at this point?",
    "What does the opposing counsel say about this submission, and why are they not correct?",
    "Could you please tell the Court exactly where you are in your Factum at this point?",
    "What does the opposing counsel say about this submission, and why are they not correct?",
    "As you are aware, we are not bound by any precedents. Could you please tell the Court why we should follow the law in the main authorities that you rely upon?",
    "What are the policy implications of your submissions, and would they take the law in this area in a positive direction? Are there not some risks of interpreting the law in this manner?",
    "What are the implications of your submissions on the goal of keeping our legal rules as simple and predictable as possible?",
    "Were the errors you argue significant enough to justify the remedy you are seeking? In other words, would the result at trial necessarily have been different if those errors did not occur?"
],
[
    "Did not some of the evidence at trial support the positions of the Appellant on the issues before this Court?",
    "Is it not the main role of this Court to look for any possible error from the trial below in order to protect against a wrongful conviction?",
    "Are not some of the facts of the cases you rely upon very different from the facts of this case?",
    "Would you agree that the trial judge did not articulate the legal tests as clearly as they could have?",
    "Is there at least a possibility that the trial judge used legal tests inconsistent with those set out in the authorities, and if there is any uncertainty on this issue, should we not err on the side of ordering a new trial?",
    "Could you please tell the Court exactly where you are in your Factum at this point?",
    "What does the opposing counsel say about this submission, and why are they not correct?",
    "As you are aware, we are not bound by any precedents. Could you please tell the Court why we should follow the law in the main authorities that you rely upon?",
    "Your friend also argues that the evidence did not support the findings the trial judge made. Should we be able to reconsider the evidence in this case and conclude that different findings should have been made?",
    "Would you agree that if we find that the trial judge made any errors that there will have to be a new trial ordered?"
]]

export default function Scene({ appConfig, appPaused }) {
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
                        speaks={true} subtitles={appConfig.closedCaption} appPaused={appPaused} snoozeEnabled={appConfig.delay} subtitles={appConfig.closedCaption}/>

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