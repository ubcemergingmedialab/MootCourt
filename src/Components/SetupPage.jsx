import { useState } from 'react'
import './setupStyles.css'

function SetupPage({presentationPage}) {
    const [show,setShow]= useState (false);
    const handleOpen= ()=>{
        setShow(!show);
    }
    
    return (<>
        <div> 
            <h1>Moot Practice Setup</h1>
            <button onClick={()=> {presentationPage()}}>Start</button>
            <button> Back</button>
        </div>
        <div>
            <h1>Position</h1>
            <button>Appellant</button>
            <button>Respondent</button>
        </div>
        <div>
            <h1>Environment</h1>
            <button>Daytime</button>
            <button>Nighttime</button>
        </div>
        <div onClick={handleOpen}>
            <h1>Questions</h1>
            {show &&(
            <div> 
                <h3>Interval</h3>
                <h3>Randomized Questions</h3>
                <h3>Delay Questions</h3>
            </div>
            )}
        </div>
        <div onClick ={handleOpen}>
            <h1>Timer</h1>
            {show &&(
            <div> 
                <h3>Total Time</h3>
                <h3>First Warning</h3>
                <h3>Second Warning</h3>
            </div>
            )}
        </div>
        <div>
            <h1>Accessibility</h1>
            <h3>Closed Captions</h3>
        </div>
    </>)
}

export default SetupPage