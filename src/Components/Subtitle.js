//import React, { useEffect } from 'react'
import { useXR } from '@react-three/xr'
import { useControls } from 'leva'
//import { useState } from 'react'


import React, { useState } from "react";
import { extend, Canvas } from "@react-three/fiber";
import { Text } from "troika-three-text";
import fonts from "./fonts";

extend({ Text });

// const text = "\(owo)/ subtitles here (o3o)//*";

function Subtitle({ textToSay }) {
    // State:
    const [rotation, setRotation] = useState([0, 0, 0, 0]);
    const [opts, setOpts] = useState({
        font: "Roboto Slab",
        fontSize: .1,
        color: "#05337d",
        maxWidth: 300,
        lineHeight: 1,
        letterSpacing: 0,
        textAlign: "justify",
        materialType: "MeshPhongMaterial"
    });

    // Handlers:
    const onMouseMove = e => {
        setRotation([
            ((e.clientY / e.target.offsetHeight - 0.5) * -Math.PI) / 8,
            ((e.clientX / e.target.offsetWidth - 0.5) * -Math.PI) / 8,
            0
        ]);
    };

    return (<>
        <text
                    position-z={1}
                    rotation={rotation}
                    {...opts}
                    text={textToSay}
                    font={fonts[opts.font]}
                    anchorX="center"
                    anchorY="middle"
                >
                    {opts.materialType === "MeshPhongMaterial" ? (
                        <meshPhongMaterial attach="material" color={opts.color} />
                    ) : null}
                </text>

                <pointLight position={[-100, 0, -160]} />
                <pointLight position={[0, 0, -170]} />
                <pointLight position={[100, 0, -160]} />
   </> );
}
export default Subtitle