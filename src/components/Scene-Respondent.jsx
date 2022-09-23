import { Suspense, useEffect, useState } from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import { useSpring, animated } from '@react-spring/three'
import JudgeAvatar from './JudgeAvatar'
import Model from './Model'
import Player from './Player'
import '../styles.css'
import PropTypes from 'prop-types'
import { configure } from '@testing-library/react'

const testlistOfUtterances = ["Council, you may begin your presentation.", 
"Does this new policy not take away any incentive of the server to provide excellent service?",
 "We do not have automatic tips for other types of service work, so why should we have one for restaurant servers?",
 "Does this policy not penalize servers who go above and beyond in their service and who are appropriately given tips in the 20% range?"]

export default function RespondentScene({appPaused, timerWarning }) {
    const [config, setConfig] = useState({"position":2,"environment":0,"random":false,"delay":false,"cutoff":false,"closedCaption":false,"questionInterval":1,"totalTime":5,"firstWarning":2,"secondWarning":1,"questionsList":[]})
    return (<>
        <Suspense fallback={null}>
            <VRCanvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Hands
                />
                {config !== {} ? <>

                    <JudgeAvatar position={[0, -2, -4]} key={"judge_1"} id={"judge_1"} animated={true} listOfUtterances={testlistOfUtterances}
                        utteranceSplit={window.parseInt(config.questionInterval) * 60000} randomizeQuestions={config.random}
                        speaks={true} subtitles={config.closedCaption} appPaused={appPaused} snoozeEnabled={config.delay} shouldWrapUp={timerWarning}/>

                    </> : null}
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

RespondentScene.propTypes = {
    appPaused: PropTypes.bool,
    timerWarning: PropTypes.bool
}