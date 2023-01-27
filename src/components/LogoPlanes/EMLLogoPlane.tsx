import {useTexture} from "@react-three/drei";
import {useRef} from 'react'

export default function EMLLogoPlane(props:any) {
    const EMLLogo = useTexture({
      map: './textures/UBC_Alternate_reverse_white.png',
    })
    const mesh = useRef()
    return (
      <mesh
        {...props}
        ref={mesh}
        >
        <planeGeometry args={[4.459, 0.752, 1]} />
        <meshStandardMaterial {...EMLLogo} transparent={true} color={'#102444'}/>
      </mesh>
    )
  }