import { useState } from 'react'
import './setupStyles.css'

function SetupPage({presentationPage, homePage}) {
    const [showQuestion,setShowQuestion]= useState(false);
    const questionOpen= ()=>{
        setShowQuestion(!showQuestion);
    }
    const [showTimer,setShowTimer]= useState(false);
    const timerOpen= ()=>{
        setShowTimer(!showTimer);
    }
    const [showAccess,setShowAccess]= useState(false);
    const accessOpen= ()=>{
        setShowAccess(!showAccess);
    }
    const [randomToggle, setRandomToggle]=useState(false);
    const triggerRandomToggle= () => {
            setRandomToggle(!randomToggle)
    }
    const [delayToggle, setDelayToggle]=useState(false);
    const triggerDelayToggle= () => {
            setDelayToggle(!delayToggle)
    }
    const [cutOffToggle, setCutOffToggle]=useState(false);
    const triggerCutOffToggle= () => {
            setCutOffToggle(!cutOffToggle)
    }
    const [closedCaptionToggle, setClosedCaptionToggle]=useState(false);
    const triggerClosedCaptionToggle= () => {
            setClosedCaptionToggle(!closedCaptionToggle)
    }
    
    
    return (<>
        <body className="setup">
            <div> 
                <button className="button-type1"onClick={()=> {homePage()}}>Back</button>
            </div>
            <div className="header">
                <h1>Moot Practice Setup</h1>
            </div>
            <div className="select-box">
                <div className="button-header">
                    <h2>Position</h2>
                    <p>Position determines the question set</p>
                    <button className="button-type3">Appellant</button>
                    <button className="button-type4">Respondent</button>
                </div>
                <div className="button-header">
                    <h2>Environment</h2>
                    <p>A description for environment</p>
                    <button className="button-type3">Daytime</button>
                    <button className="button-type4">Nighttime</button>
                </div>
            </div>
            <div className="accordion-container">
                <div>
                    <div className="accordion" onClick={questionOpen}>
                        <h2 className="accordion-title">Questions</h2>
                    </div>
                    {showQuestion && (
                    <div className="accordion-content"> 
                    
                        <div className="content">
                            <label className="input-header">
                                <h3>Interval</h3>
                                <p>Approximate time between when questions will be asked</p>
                            </label>
                            <input className="input-wrapper" type="text" placeholder="minutes"/>
                        </div>   
                       
                        <div className="content">
                            <div className="input-header">
                                <h3>Randomized Questions</h3>
                                <p>Randomize the order that the questions will be asked</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" onClick={() => {triggerRandomToggle()}} checked={randomToggle? true : false}/>
                                    <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="content">
                            <div className="input-header">
                                <h3>Delay Questions</h3>
                                <p>Allow the ability to delay when the next question will be asked</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" onClick={() => {triggerDelayToggle()}} checked={delayToggle? true : false}/>
                                    <span className="slider round"></span>
                            </label>
                            
                        </div>
                        <div className="content">
                            <button>Add your own questions</button>
                        </div>
                    </div>
                    )}
                </div>
                <div>
                    <div className="accordion" onClick={timerOpen}>
                        <h2 className="accordion-title">Timer</h2>
                    </div>
                    
                    {showTimer &&(
                    <div className="accordion-content">
                        <div className="content">
                                <label className="input-header">
                                    <h3>Total Time</h3>
                                    <p>Total amount of time allowed for the oral presentation</p>
                                </label>
                                <input className="input-wrapper" type="text" placeholder="minutes"/>
                        </div> 
                        <div className="content">
                                <label className="input-header">
                                    <h3>First Warning</h3>
                                    <p>Time when first warning is given</p>
                                </label>
                                <input className="input-wrapper" type="text" placeholder="minutes"/>
                        </div>
                        <div className="content">
                                <label className="input-header">
                                    <h3>Second Warning</h3>
                                    <p>Time when second warning is given</p>
                                </label>
                                <input className="input-wrapper" type="text" placeholder="minutes"/>
                        </div>
                        <div className="content">
                            <div className="input-header">
                                <h3>Cut Off Presentation</h3>
                                <p>Stop the oral presentation when the time is over</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" onClick={() => {triggerCutOffToggle()}} checked={cutOffToggle? true : false}/>
                                    <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    )} 
                </div>
                <div>
                    <div className="accordion" onClick={accessOpen}>
                        <h2 className="accordion-title">Accessibility</h2>
                    </div>
                    {showAccess&&(
                    <div className="accordion-content">
                        <div className="content">
                            <div className="input-header">
                                <h3>Closed Captions</h3>
                                <p>Show closed captions on the screen during animations</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox"/>
                                    <span className="slider round" onClick={() => {triggerClosedCaptionToggle()}} checked={closedCaptionToggle? true : false}></span>
                            </label>
                        </div>
                    </div>
                    )}
                </div> 
            </div>
            <div>
                <a className="nobgbutton">Reset to default</a>
                <button className="button-type2" onClick={()=> {presentationPage()}}>Start</button>
            </div>  
        </body>
    </>)
}

export default SetupPage