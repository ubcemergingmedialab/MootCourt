import { Html } from '@react-three/drei'
import { Suspense } from 'react';
import { useEffect } from 'react/cjs/react.development';
import './snoozeStyles.css'
function QuestionSnooze(props) {

    useEffect(() => {
        console.log('mounting question snooze')
    }, [])
    return <Suspense fallback={null}><group>
        <mesh {...props} >
            <Html>
                <div className={"snooze"}> <div className={"snoozeInner"}>Question will be asked in {props.timeLeft} seconds </div><button className={"snooze"} type="button" onPointerDown={() => props.snoozeQuestion(30000)}>Snooze</button></div>
            </Html>
        </mesh>
    </group></Suspense>
}

export default QuestionSnooze;