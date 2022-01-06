import { Html } from '@react-three/drei'
import './snoozeStyles.css'
function QuestionSnooze( props ) {
    return <group>
        <mesh {...props} >
            <Html>
                <div className={"snooze"}> <div className={"snoozeInner"}>Question will be asked in {props.timeLeft} seconds </div><button  className={"snooze"} type="button" onPointerDown={() => props.snoozeQuestion(30000)}>Snooze</button></div>
            </Html>
        </mesh>
    </group>
}

export default QuestionSnooze;