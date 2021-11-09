import { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Camera } from 'three'
import { useXR } from '@react-three/xr'

function Compass() {
    const { camera } = useThree()
    const coneRef = useRef()
    useFrame(() => {
        coneRef.current.rotation.x = camera.rotation.x + -Math.PI / 2
        coneRef.current.rotation.y = camera.rotation.y
        coneRef.current.rotation.z = camera.rotation.z
    })

    const compassRef = useRef()
    useFrame(() => {
        compassRef.current.rotation.x = camera.rotation.x
        compassRef.current.rotation.y = camera.rotation.y
        compassRef.current.rotation.z = camera.rotation.z
    })
    return (
        <mesh ref={compassRef}>
            <mesh>
                <dodecahedronBufferGeometry attach="geometry"> </dodecahedronBufferGeometry>
            </mesh>
            <mesh
                ref={coneRef}
                position={[0, 2, -5]}
                scale={[0.2, 0.2, 0.2]}
            >
                <coneGeometry attach="geometry" args={[2, 6, 20]}></coneGeometry>
                <meshPhysicalMaterial attach="material" color={"red"}></meshPhysicalMaterial>
            </mesh>
        </mesh>
    )
}

export default Compass