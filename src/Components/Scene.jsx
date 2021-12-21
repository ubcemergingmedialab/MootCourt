import { useEffect, useState } from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import { useSpring, animated } from '@react-spring/three'
import JudgeAvatar from './JudgeAvatar'
import Model from './Model'
import Player from './Player'

export default function Scene() {
    const [animateCamera, setAnimateCamera] = useState(false)
    const props = useSpring({rotation: animateCamera? [0,0, 0]: [0,-Math.PI/2,0], config: {duration: 10000}})
    const AnimatedPlayer = animated(Player)
    useEffect(() => {
        setTimeout(() => {
            console.log('animating camera')
            setAnimateCamera(true)
        }, 1000)
    }, [])
    return (<>
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
            <JudgeAvatar position={[-2, -2, -4]} utteranceSplit={180000} animated={false} />

            <JudgeAvatar position={[0, -2, -4]} utteranceSplit={180000} speaks={true} />

            <JudgeAvatar position={[2, -2, -4]} utteranceSplit={180000} animated={false} />
            <Model modelUrl="./models/courtroompropsNov17.glb"
                pos={[0, -3, 3.5]}
                rot={[0, 0, 0]}
                sca={[0.06, 0.06, 0.06]} />
            <Model modelUrl="./models/courtroomwallsNov17.glb"
                pos={[0, -3, 3.5]}
                rot={[0, 0, 0]}
                sca={[0.06, 0.06, 0.06]} />
            <Model modelUrl="./models/courtroomdesksNov17.glb"
                pos={[0, -3, 3.5]}
                rot={[0, 0, 0]}
                sca={[0.06, 0.06, 0.06]} />
            <DefaultXRControllers />
            <AnimatedPlayer position={[0, 0.5, 0]} rotation={props.rotation} /></VRCanvas></>)
}