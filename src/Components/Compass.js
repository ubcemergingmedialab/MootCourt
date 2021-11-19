import { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Camera, Color } from 'three'
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
        <mesh ref={compassRef} scale={[0.2, 0.2, 0.2]} position={[4, -0.5, 1]}>
            <mesh scale={[4, 4, 4]}>
                <dodecahedronBufferGeometry attach="geometry"> </dodecahedronBufferGeometry>
                <meshStandardMaterial attach="material" color={new Color(1, 1, 1)} opacity={0.7} transparent={true}></meshStandardMaterial>
            </mesh>
            <mesh
                ref={coneRef}
                scale={[0.3, 0.3, 0.3]}
            >
                <coneGeometry attach="geometry" args={[2, 6, 20]}></coneGeometry>
                <meshPhysicalMaterial attach="material" color={"red"}></meshPhysicalMaterial>
            </mesh>
        </mesh>
    )
}

export default Compass