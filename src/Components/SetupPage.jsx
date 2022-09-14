import { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import useMeasure from 'react-use-measure'
import AddQuestionsPopup from './AddQuestionsPopup';
import './setupStyles.css'
import PropTypes from 'prop-types'


const defaultQuestions = [["The provincial government, after receiving advice from a number of interested groups, decided to change tipping policy in British Columbia. Complaints about the current policy included: customers feeling pressured to tip at increasingly high rates (including through high percentage “options” provided to them in card machines), tourists not understanding tipping customs in the province; and, some servers being provided little or no tip despite excellent service. The government decided that the new policy is that there would be an automatic tip of 12% provided to each bill where customers were served food or drinks by a server. Tell us if you agree or disagree with this rule! Council, you may begin your presentation.", "Would you not agree that being a server in a restaurant is very hard work and that these persons deserve more than the minimum wage they are usually paid by restaurants?",
    "Would this policy not be fairer in the sense that the tip would not depend on the particular generosity of the person being served?",
    "Does this policy not simplify the whole restaurant experience because the customer is just presented with a final bill they can pay with a quick tap?"], ["The provincial government, after receiving advice from a number of interested groups, decided to change tipping policy in British Columbia. Complaints about the current policy included: customers feeling pressured to tip at increasingly high rates (including through high percentage “options” provided to them in card machines), tourists not understanding tipping customs in the province; and, some servers being provided little or no tip despite excellent service. The government decided that the new policy is that there would be an automatic tip of 12% provided to each bill where customers were served food or drinks by a server. Tell us if you agree or disagree with this rule! Council, you may begin your presentation.",    "Does this new policy take away any incentive of the server to provide excellent service?",
        "We don’t have automatic tips for other types of service work, so why should we have one for restaurants?",
        "Does this policy not penalize servers who go above and beyond in their service and are appropriately given tips in the 20% range?"]]

function SetupPage({ presentationPage, homePage, updateConfig }) {
    const [positionWarning, setPositionWarning] = useState(false);
    const [questionsInfo, setQuestionsInfo] = useState(false);
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
    const [positionState, setPositionState] = useState()

    const appellant = function () {
        setPositionWarning(false)
        setPositionState(Appellant)
        setShouldQuestionsUpdate(true)
    }
    const respondent = function () {
        setPositionWarning(false)
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
        if (positionState === Respondent) {
            setQuestionsList(defaultQuestions[0])
        } else if (positionState === Appellant) {
            setQuestionsList(defaultQuestions[1])
        }
        setTotalTime(20)
        setFirstWarning(15)
        setSecondWarning(17)
        setQuestionInterval(3)
        setEnvironmentState(Daytime)
        setClosedCaptionToggle(false)
        setCutOffToggle(false)
        setDelayToggle(false)
        setRandomToggle(false)

    }

    useEffect(() => {
        setDefaults({
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
                <button className="button-type1 button" onClick={() => { homePage() }}>Back to home</button>
            </div>
            <div className="header">
                <h1>Moot Practice Setup</h1>
            </div>
            <div className="select-box">
                <div className="button-header">
                    <h2>Position</h2>
                    <p>Position determines the question set (overwrites questions in blue)</p>
                    <button className={(typeof (positionState) != "undefined" && (positionState === Appellant)) ? "button-type3-active" : "button-type3"} onClick={() => { appellant(); appellantButton() }}>Appellant</button>
                    <button className={(typeof (positionState) != "undefined" && (positionState === Respondent)) ? "button-type4-active" : "button-type4"} onClick={() => { respondent(); respondentButton() }}>Respondent</button>
                </div>
                <div className="button-header">
                    <h2>Environment</h2>
                    <p>(coming soon!)</p>
                    <button className={eButtonFillState ? "button-type3" : "button-type3-active"} onClick={() => { daytime(); daytimeButton() }}>Daytime</button>
                    <button className={!eButtonFillState ? "button-type4" : "button-type4-active"} onClick={() => { nighttime(); nighttimeButton() }}>Nighttime</button>
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
                                <button className="button-type5" onClick={() => { enableQuestionsPopup() }} >Add your own questions</button>
                                {questionsInfo ? <div style={{ zIndex: 1, position: "fixed", width: "50%", height: "43%", overflow: "auto", backgroundColor: "#FFFFFFFa", top: "20%", border: "1px solid black" }}>
                                    <ul>
                                        <li> If you make no changes on this page, the default questions in blue will be asked during your presentation. </li>
                                        <li><b>To delete a question:</b> Click the “x” button to the right of each question that you do not want to be asked during your presentation.</li>
                                        <li><b>To amend a question:</b> Click into the textbox of a question to edit the question that you wish to be asked, or to delete all of the text and write a new question.</li>
                                        <li><b>To add a new question:</b> Click into the white textbox below to add your own custom question.
                                            <ul><li style={{ listStyleType: "circle" }}><b>Tip:</b> If you are practicing with someone else, consider having that person enter custom questions that are tailored to your argument to enable you to practice responding to a question without knowing the context of the questions that are coming.</li></ul></li>
                                        <li><b>To save your changes:</b> If you wish to save your changes to the questions, click the “Save” button. </li>
                                        <li><b>To reset to the default questions:</b> Return to the set-up page by clicking "Submit" and use the "reset to default" button and the bottom, or click the Position button again</li>
                                    </ul></div> : null}
                                <img src="./info.png" onPointerEnter={() => { setQuestionsInfo(true) }} onPointerLeave={() => { setQuestionsInfo(false) }} />
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
                {positionWarning ? <p style={{ color: "red" }}>Please choose between Appellant or Respondent</p> : null}
                <button type="button" className="nobgbutton" onClick={() => { setToDefault() }}>Reset to default</button>
                <button className="button-type2" onClick={() => {
                    if (positionState === undefined) {
                        setPositionWarning(true)
                    } else {
                        presentationPage()
                    }
                }}>Start</button>
            </div>
        </div>
    </>)
}

SetupPage.propTypes = {
    /** Transitions app state machine to the Presentation state */
    presentationPage: PropTypes.func,
    /** Transitions app state machine to the Homepage state */
    homePage: PropTypes.func,
    /** communicates configuration object to parent every time config changes */
    updateConfig: PropTypes.func
}

export default SetupPage