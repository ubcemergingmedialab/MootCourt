import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import useMeasure from 'react-use-measure'
import AddQuestionsPopup from './AddQuestionsPopup';
import './setupStyles.css'

function SetupPage({ presentationPage, homePage, updateConfig }) {

    const [defaults, setDefaults] = useState({})
    const [questionsList, setQuestionsList] = useState([])
    const [popupOpen, setPopupOpen] = useState(false);
    const enableQuestionsPopup = () => {
        setPopupOpen(true);
    }
    const disableQuestionsPopup = () => {
        setPopupOpen(false);
        setShouldQuestionsUpdate(false)
    }

    ///state for UI
    const [showQuestion, setShowQuestion] = useState(true);
    const questionOpen = () => {
        setShowQuestion(!showQuestion);
    }
    const [showTimer, setShowTimer] = useState(true);
    const timerOpen = () => {
        setShowTimer(!showTimer);
    }
    const [showAccess, setShowAccess] = useState(true);
    const accessOpen = () => {
        setShowAccess(!showAccess);
    }

    //state for app configuration
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
        setShouldQuestionsUpdate(true)
    }
    const respondent = function () {
        setPositionState(Respondent)
        setShouldQuestionsUpdate(true)
    }

    const [shouldQuestionsUpdate, setShouldQuestionsUpdate] = useState(true)

    const appellantButtonFill = 0
    const respondentButtonFill = 1
    const [pButtonFillState, setPButtonFillState] = useState(appellantButtonFill)
    
    const appellantButton = function () {
        setPButtonFillState(appellantButtonFill)
    }
    const respondentButton = function () {
        setPButtonFillState(respondentButtonFill)
    }

    const Daytime = 0
    const Nighttime = 1
    const [environmentState, setEnvironmentState] = useState(Daytime)

    const daytime = function () {
        setEnvironmentState(Daytime)
    }
    const nighttime = function () {
        setEnvironmentState(Nighttime)
    }

    const daytimeButtonFill = 0
    const nighttimeButtonFill = 1
    const [eButtonFillState, setEButtonFillState] = useState(daytimeButtonFill)
    
    const daytimeButton = function () {
        setEButtonFillState(daytimeButtonFill)
    }
    const nighttimeButton = function () {
        setEButtonFillState(nighttimeButtonFill)
    }

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

    const setToDefault = () => {
        setConfig(defaults)
        setTotalTime(20)
        setFirstWarning(15)
        setSecondWarning(17)
        setQuestionInterval(3)
        setEnvironmentState(Daytime)
        setPositionState(Appellant)
        setClosedCaptionToggle(false)
        setCutOffToggle(false)
        setDelayToggle(false)
        setRandomToggle(false)

    }
    
    useEffect(() => {
        setDefaults({
            position: positionState,
            environment: environmentState,
            random: randomToggle,
            delay: delayToggle,
            cutoff: cutOffToggle,
            closedCaption: closedCaptionToggle,
            questionInterval,
            totalTime,
            firstWarning,
            secondWarning,
            questionsList
        })
        setConfig({
            position: positionState,
            environment: environmentState,
            random: randomToggle,
            delay: delayToggle,
            cutoff: cutOffToggle,
            closedCaption: closedCaptionToggle,
            questionInterval,
            totalTime,
            firstWarning,
            secondWarning,
            questionsList
        })
    }, [])

    const [config, setConfig] = useState(defaults)

    useEffect(() => {
        updateConfig(config)
    }, [config])

    useEffect(() => {
        setConfig({
            position: positionState,
            environment: environmentState,
            random: randomToggle,
            delay: delayToggle,
            cutoff: cutOffToggle,
            closedCaption: closedCaptionToggle,
            questionInterval,
            totalTime,
            firstWarning,
            secondWarning,
            questionsList
        })
    }, [positionState, environmentState, randomToggle, delayToggle, cutOffToggle, closedCaptionToggle, questionInterval, totalTime, firstWarning, secondWarning, questionsList])


    return (<>{popupOpen ? <AddQuestionsPopup shouldUpdate={shouldQuestionsUpdate} setQuestionsList={setQuestionsList} disable={disableQuestionsPopup} position={positionState}></AddQuestionsPopup> : null}
        <div className="page-setup">
            <div>
                <button className="button-type1 button" onClick={() => { homePage() }}>Back</button>
            </div>
            <div className="header">
                <h1>Moot Practice Setup</h1>
            </div>
            <div className="select-box">
                <div className="button-header">
                    <h2>Position</h2>
                    <p>Position determines the question set (overwrites questions in blue)</p>
                    <button className={ pButtonFillState? "button-type3":"button-type3-active"} onClick={() => { appellant(); appellantButton() }}>Appellant</button>
                    <button className={!pButtonFillState? "button-type4":"button-type4-active"} onClick={() => { respondent(); respondentButton() }}>Respondent</button>
                </div>
                <div className="button-header">
                    <h2>Environment</h2>
                    <p>(coming soon!)</p>
                    <button className={ eButtonFillState? "button-type3":"button-type3-active"} onClick={() => { daytime(); daytimeButton() }}>Daytime</button>
                    <button className={!eButtonFillState? "button-type4":"button-type4-active"} onClick={() => { nighttime(); nighttimeButton()}}>Nighttime</button>
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
                                        <input type="checkbox" onChange={() => { triggerRandomToggle() }} checked={randomToggle ? true : false} />
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
                                        <input type="checkbox" onChange={() => { triggerDelayToggle() }} checked={delayToggle ? true : false} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>
                            <div className="content">
                                <button className="button-type5"onClick={() => { enableQuestionsPopup() }} >Add your own questions</button>
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
                                    <input className="input-wrapper" type="text" value={firstWarning} onChange={handleFirstWarningChange} />
                                    <label>minutes</label>
                                </div>
                            </div>
                            <div className="content">
                                <div>
                                    <h3>Second Warning</h3>
                                    <p>Time when second warning is given</p>
                                </div>
                                <div className="input-formatter">
                                    <input className="input-wrapper" type="text" value={secondWarning} onChange={handleSecondWarningChange} />
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
            <div className={"footer-buttons"}>
                <button type="button" className="nobgbutton" onClick={() => {setToDefault()}}>Reset to default</button>
                <button className="button-type2" onClick={() => { presentationPage() }}>Start</button>
            </div>
        </div>
    </>)
}

export default SetupPage