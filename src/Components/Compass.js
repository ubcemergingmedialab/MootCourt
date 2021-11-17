import { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Camera } from 'three'
import { useXR } from '@react-three/xr'

function Compass() {
    const { camera } = useThree()
    const coneRef = useRef()
    useFrame(() => {
        //coneRef.current.setRotationFromQuaternion(camera.quaternion.normalize())
    })

    const compassRef = useRef()
    useFrame(() => {
        compassRef.current.position.x = camera.position.x
        compassRef.current.position.y = camera.position.y
        compassRef.current.position.z = camera.position.z
    })
    return (
        <mesh ref={compassRef}
        scale={[2, 2, 2]}>
            <mesh>
                
            <mesh scale={[0.2, 0.2, 0.2]} position={[0.5, 0.2, 0]}>
                <dodecahedronBufferGeometry attach="geometry"> </dodecahedronBufferGeometry>
                <meshStandardMaterial transparent={false} opacity={0.6} color={"red"}></meshStandardMaterial>
            </mesh>
                <dodecahedronBufferGeometry attach="geometry"> </dodecahedronBufferGeometry>
                <meshStandardMaterial transparent={true} opacity={0.6}></meshStandardMaterial>
            </mesh>
            <mesh
                ref={coneRef}
                scale={[0.15, 0.15, 0.15]}
            >
                <coneGeometry attach="geometry" args={[1, 3, 20]}></coneGeometry>
                <meshPhysicalMaterial attach="material" color={"red"}></meshPhysicalMaterial>
            </mesh>
        </mesh>
    )
}

export default Compass