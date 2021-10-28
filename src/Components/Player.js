import React, {useEffect} from 'react'
import { useXR } from '@react-three/xr'

function Player({startPosition}) {
    const { player } = useXR()
    useEffect(() => {
        player.position.x = startPosition[0]
        player.position.y = startPosition[1]
        player.position.z = startPosition[2]
    },[])

    return (<mesh></mesh>)
}

export default Player