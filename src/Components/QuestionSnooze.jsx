import { Html } from '@react-three/drei'
import { Suspense } from 'react';
import { useEffect } from 'react/cjs/react.development';
import './snoozeStyles.css'
import PropTypes from 'prop-types'

function QuestionSnooze(props) {

    useEffect(() => {
        console.log('mounting question snooze')
    }, [])
    return <Suspense fallback={null}><group>
        <mesh {...props} >
            <Html>
                <div className={"snooze"}> 
                    <div className={"snoozeInner"}>Question will be asked in {props.timeLeft} seconds </div>
                    <button className={"snooze"} type="button" onPointerDown={() => props.snoozeQuestion(30000)}>Snooze</button>
                </div>
            </Html>
        </mesh>
    </group></Suspense>
}

QuestionSnooze.propTypes = {
    /** Communicates to parent that snooze button was pressed */
    snoozeQuestion: PropTypes.func,
}

export default QuestionSnooze;