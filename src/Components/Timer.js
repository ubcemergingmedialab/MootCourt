import { useEffect, useState } from 'react'
import { SphereBufferGeometry } from 'three'

function Timer({ yellowTime, redTime, position, rotation, scale }) {

    const [timerColor, setTimerColor] = useState("green")

    useEffect(() => {
        if (yellowTime && redTime) {
            setTimeout(() => {
                setTimerColor("yellow")
            }, yellowTime)
            setTimeout(() => {
                setTimerColor("red")
            }, redTime)
        }
    }, [])

    return <><mesh
        position={position ? position : [0, 0, 0]}
        rotation={rotation ? rotation : [0, 0, 0]}
        scale={scale ? scale : [1, 1, 1]}>
        <pointLight intensity={0} color={timerColor}></pointLight>
        <sphereBufferGeometry attach="geometry"></sphereBufferGeometry>
        <meshPhysicalMaterial attach="material" color={timerColor} emissive={timerColor} emissiveIntensity={4}></meshPhysicalMaterial>
    </mesh></>
}

export default Timer;