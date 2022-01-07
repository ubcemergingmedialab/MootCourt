import { useState, useEffect } from 'react'
import './setupStyles.css'

function SetupPage({ presentationPage, homePage, addQuestionsPage, updateConfig }) {
    const [showQuestion, setShowQuestion] = useState(false);
    const questionOpen = () => {
        setShowQuestion(!showQuestion);
    }
    const [showTimer, setShowTimer] = useState(false);
    const timerOpen = () => {
        setShowTimer(!showTimer);
    }
    const [showAccess, setShowAccess] = useState(false);
    const accessOpen = () => {
        setShowAccess(!showAccess);
    }
    const [randomToggle, setRandomToggle] = useState(false);
    const triggerRandomToggle = () => {
        setRandomToggle(!randomToggle)
    }
    const [delayToggle, setDelayToggle] = useState(false);
    const triggerDelayToggle = () => {
        setDelayToggle(!delayToggle)
    }
    const [cutOffToggle, setCutOffToggle] = useState(false);
    const triggerCutOffToggle = () => {
        setCutOffToggle(!cutOffToggle)
    }
    const [closedCaptionToggle, setClosedCaptionToggle] = useState(false);
    const triggerClosedCaptionToggle = () => {
        setClosedCaptionToggle(!closedCaptionToggle)
    }
    const Appellant = 0
    const Respondent = 1
    const [positionState, setPositionState] = useState(Appellant)
  
    const appellant = function () {
      setPositionState(Appellant)
    }
    const respondent = function () {
      setPositionState(Respondent)
    
    const [questionInterval, setQuestionInterval] = useState(3)

    const handleQuestionIntervalChange = (e) => {
        setQuestionInterval(e.target.value)
    }
    
    const [totalTime, setTotalTime] = useState(20)
    const [firstWarning, setFirstWarning] = useState(15)
    const [secondWarning, setSecondWarning] = useState(17)

    const handleTotalTimeChange = (e) => {
        setTotalTime(e.target.value)
    }

    const handleFirstWarningChange = (e) => {
        setFirstWarning(e.target.value)
    }

    const handleSecondWarningChange = (e) => {
        setSecondWarning(e.target.value)
    }

    let defaults = {}
    useEffect(() => {
        defaults = {
            position: positionState,
            random: randomToggle,
            delay: delayToggle,
            cutoff: cutOffToggle,
            closedCaption: closedCaptionToggle,
            questionInterval,
            totalTime,
            firstWarning,
            secondWarning
        }
    }, [])

    const [config, setConfig] = useState(defaults)

    useEffect(() => {
        updateConfig(config)
    }, [config])

    useEffect(() => {
        setConfig({
            position:positionState,
            random: randomToggle,
            delay: delayToggle,
            cutoff: cutOffToggle,
            closedCaption: closedCaptionToggle,
            questionInterval,
            totalTime,
            firstWarning,
            secondWarning
        })
    }, [positionState,randomToggle, delayToggle, cutOffToggle, closedCaptionToggle, questionInterval, totalTime, firstWarning, secondWarning])


    return (<>
        <div className="page-setup">
            <div>
                <button className="button-type1" onClick={() => { homePage() }}>Back</button>
            </div>
            <div className="header">
                <h1>Moot Practice Setup</h1>
            </div>
            <div className="select-box">
                <div className="button-header">
                    <h2>Position</h2>
                    <p>Position determines the question set</p>
                    <button className="button-type3" onClick={()=>{appellant()}}>Appellant</button>
                    <button className="button-type4" onClick={()=>{respondent()}}>Respondent</button>
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
                                <div>
                                    <h3>Interval</h3>
                                    <p>Approximate time between when questions will be asked</p>
                                </div>
                                <div className="input-formatter">
                                    <input className="input-wrapper" type="text" value={questionInterval} onChange={handleQuestionIntervalChange} />
                                    <label>minutes</label>
                                </div>
                            </div>

                            <div className="content">
                                <div className="content-stretch">
                                    <h3>Randomized Questions</h3>
                                    <p>Randomize the order that the questions will be asked</p>
                                </div>
                                <div className="switch">
                                    <label>
                                        <input type="checkbox" onClick={() => { triggerRandomToggle() }} checked={randomToggle ? true : false} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="content">
                            
                                <div className="content-stretch"> 
                                    <h3>Delay Questions</h3>
                                    <p>Allow the ability to delay when the next question will be asked</p>
                                </div>
                                <div className="switch">
                                    <label>
                                        <input type="checkbox" onClick={() => { triggerDelayToggle() }} checked={delayToggle ? true : false} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>
                            <div className="content">
                                <button onClick={() => { addQuestionsPage() }} >Add your own questions</button>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="accordion" onClick={timerOpen}>
                        <h2 className="accordion-title">Timer</h2>
                    </div>

                    {showTimer && (
                        <div className="accordion-content">
                            <div className="content">
                                <div>
                                    <h3>Total Time</h3>
                                    <p>Total amount of time allowed for the oral presentation</p>
                                </div>
                                <div className="input-formatter">
                                    <input className="input-wrapper" type="text" value={totalTime} onChange={handleTotalTimeChange} />
                                    <label>minutes</label>
                                </div>
                            </div>
                            <div className="content">
                                <div>
                                    <h3>First Warning</h3>
                                    <p>Time when first warning is given</p>
                                </div>
                                <div className="input-formatter">
                                    <input className="input-wrapper" type="text" value={firstWarning} onChange={handleFirstWarningChange}/>
                                    <label>minutes</label>
                                </div>
                            </div>
                            <div className="content">
                                <div>
                                    <h3>Second Warning</h3>
                                    <p>Time when second warning is given</p>
                                </div>
                                <div className="input-formatter">
                                    <input className="input-wrapper" type="text" value={secondWarning} onChange={handleSecondWarningChange}/>
                                    <label>minutes</label>
                                </div>
                            </div>
                            <div className="content">
                                <div className="content-stretch">
                                    <h3>Cut Off Presentation</h3>
                                    <p>Stop the oral presentation when the time is over</p>
                                </div>
                                <div className="switch">
                                    <label>
                                        <input type="checkbox" onClick={() => { triggerCutOffToggle() }} checked={cutOffToggle ? true : false} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="accordion" onClick={accessOpen}>
                        <h2 className="accordion-title">Accessibility</h2>
                    </div>
                    {showAccess && (
                        <div className="accordion-content">
                            <div className="content">
                                <div className="content-stretch">
                                    <h3>Closed Captions</h3>
                                    <p>Show closed captions on the screen during animations</p>
                                </div>
                                <div className="switch">
                                    <label>
                                        <input type="checkbox" />
                                        <span className="slider round" onClick={() => { triggerClosedCaptionToggle() }} checked={closedCaptionToggle ? true : false}></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <a className="nobgbutton">Reset to default</a>
                <button className="button-type2" onClick={() => { presentationPage() }}>Start</button>
            </div>
        </div>
    </>)
}

export default SetupPage