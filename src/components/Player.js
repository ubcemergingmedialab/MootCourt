import React, {useEffect} from 'react'
import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'

/** Component that can be used in an XR scene to control player position */
function Player({position, rotation}) {
    const { player } = useXR()
    useFrame(() => {
        player.position.x = position[0]
        player.position.y = position[1]
        player.position.z = position[2]
        player.rotation.x = rotation[0]
        player.rotation.y = rotation[1]
        player.rotation.z = rotation[2]
    })

    return (<mesh></mesh>)
}

export default Player