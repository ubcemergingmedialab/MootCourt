import {useTexture} from "@react-three/drei";
import {useRef} from 'react'

export default function AllardLogoPlane(props:any) {
    const AllardLogo = useTexture({
      map: './textures/PALSOL-1.2b-Primary-UBC-Shield.png',
    })
    const mesh = useRef()
    return (
      <mesh
        {...props}
        ref={mesh}
        >
        <planeGeometry args={[4.18974359, 0.975, 1]} />
        <meshStandardMaterial {...AllardLogo} transparent={true} />
      </mesh>
    )
}