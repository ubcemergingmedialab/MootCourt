import React, { useState } from 'react'
import {
    Interactive,
    Select,
    Hover,
    useXREvent,
} from '@react-three/xr'
import { Box, Sky, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'

function Button(props) {
    const [hover, setHover] = useState(false)
    const [color, setColor] = useState(0x123456)

    return (
        <Interactive
            onSelect={() => setColor((Math.random() * 0xffffff) | 0)}
            onHover={() => setHover(true)}
            onBlur={() => setHover(false)}>
            <Box args={[0.4, 0.1, 0.1]} position={props.position} rotation={props.rotation} scale={props.scale}
                onClick={() => {
                    setColor((Math.random() * 0xffffff) | 0)
                    props.clickHandler()
                }}>
                <meshStandardMaterial attach="material" color={color} />
                {<Text position={[0, 0, 0.06]} fontSize={0.05} color="#000" anchorX="center" anchorY="middle">
                    {props.buttonText}
                </Text>}
            </Box>
        </Interactive>
    )
}

export default Button;