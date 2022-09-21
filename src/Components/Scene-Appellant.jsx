import { Suspense, useEffect, useState } from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import { useSpring, animated } from '@react-spring/three'
import JudgeAvatar from './JudgeAvatar'
import Model from './Model'
import Player from './Player'
import '../styles.css'
import PropTypes from 'prop-types'
import { configure } from '@testing-library/react'

const testlistOfUtterances = ["Council, you may begin your presentation.", "Would you not agree that being a server in a restaurant is very hard work and that these persons deserve more than the minimum wage they are usually paid by restaurants?",
"Would this policy not be fairer in the sense that the tip would not depend on the particular generosity of the person being served?", 
"Does this policy not simplify the whole restaurant experience because the customer can be presented with a final bill to pay without calculating tip?"]

export default function AppellantScene({appPaused, timerWarning }) {
    const [config, setConfig] = useState({"position":0,"environment":0,"random":false,"delay":false,"cutoff":false,"closedCaption":false,"questionInterval":1,"totalTime":5,"firstWarning":2,"secondWarning":1,"questionsList":[]})
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

AppellantScene.propTypes = {
    appPaused: PropTypes.bool,
    timerWarning: PropTypes.bool
}