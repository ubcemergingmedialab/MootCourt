import { useEffect, useState } from 'react'
import { Center, Html } from '@react-three/drei'
import PropTypes from 'prop-types'
import './LandingPage.css';
import defaultData from '../general/default_settings.json';




function resetDisplayedUI(ID1, ID2) {
    const thisID = document.getElementById(ID1);
    const nextID = document.getElementById(ID2);
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'sideMenuBackground';
    }
}

function pressStart() {
    resetDisplayedUI("Main", "Position");
}


function pressCustomize() {
    resetDisplayedUI("SetUp", "Questions");
}


function pressAbout() {
    resetDisplayedUI("Main", "About");
}


function pressTutorial() {
    resetDisplayedUI("Main", "Tutorial");
}


function pressMootingResources() {
    resetDisplayedUI("Main", "MootingResources");
}


function pressFeedback() {
    resetDisplayedUI("Main", "Feedback");
}


function pressBackToMenu() {
    resetDisplayedUI("About", "Main");
}


function pressBackToMenu2() {
    resetDisplayedUI("Tutorial", "Main");
}


function pressBackToMenu3() {
    resetDisplayedUI("MootingResources", "Main");
}

function pressBackToMenu4() {
    resetDisplayedUI("Position", "Main");
}


function pressBackFromQuestions() {
    resetDisplayedUI("Questions", "SetUp");
}


function pressNextFromQuestions() {
    resetDisplayedUI("Questions", "Timer");
}


function pressBackFromTimer() {
    resetDisplayedUI("Timer", "Questions");
}

function pressBackFromSetup() {
    resetDisplayedUI("SetUp", "Position");
}

function incrementNumber(element) {
  element.parentNode.querySelector('input[type=number]').stepUp()
}

function decrementNumber(element) {
  element.parentNode.querySelector('input[type=number]').stepDown()
}


function LandingPageMenu({updateAppState, updateConfig, config}) {
    // AppState : const Scene = 1
    // !!Inputs can come in the form of minutes, but config time is always stored as seconds!!

    const setInterval = (e) => {
        updateConfig({...config, questionInterval: parseFloat(e.target.value) * 60})
    }

    const setRandomizeQuestions = () => {
        let checkBox = document.getElementById("setrandomizeQuestions") as HTMLInputElement
        updateConfig({...config, setRandomized: checkBox.checked})
    }

    const setDelay = () => {
        let checkBox = document.getElementById("setDelay") as HTMLInputElement
        updateConfig({...config, setDelay: checkBox.checked})
    }

    const setTotalTime = (e) => {
        updateConfig({...config, totalTime: parseInt(e.target.value) * 60})
    }

    const setStopPresentation = () => {
        let checkBox = document.getElementById("setStopPresentation") as HTMLInputElement
        updateConfig({...config, stopPresentation: checkBox.checked})
    }

    const setIntroductionMinutes = (e) => {
        let originalSeconds = document.getElementById("setIntroductionSeconds") as HTMLInputElement
        let newMinute = parseInt(e.target.value)
        let newIntroTime = newMinute * 60 + parseInt(originalSeconds.value)
        updateConfig({...config, introductionTime: newIntroTime})
    }

    const setIntroductionSeconds = (e) => {
        let originalMinutes = document.getElementById("setIntroductionMinutes") as HTMLInputElement
        let newSeconds = parseInt(e.target.value)
        let newIntroTime = parseInt(originalMinutes.value) * 60 + newSeconds
        updateConfig({...config, introductionTime: newIntroTime})
    }

    const pressDefault = () => {
        // updateConfig(defaultData)
        updateAppState(1)
    }

    const startApp = () => {
        updateAppState(1)
    }

    const pressAppellant = () => {
        updateConfig({...config, playerPosition: "Appellant"})
        resetDisplayedUI("Position", "SetUp");
    }

    const pressRespondent = () => {
        updateConfig({...config, playerPosition: "Respondent"})
        resetDisplayedUI("Position", "SetUp");
    }

    return <>
        {<div className="logoOverlay">
          <img src={require('../images/PALSOL-1.2b-Primary-UBC-Shield.png')} />
          <img src={require('../images/EML_Alternate_colour.png')} />
        </div>}
        {<div className="sideMenuBackground" id="Main">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Moot Court</h1>
                    <div className="hr-1"></div>
                </div>
                <div className="sideMenuContents">
                    <div className="buttonFlexBox">
                        <button className="button wide-button" type="button" id="Start" onClick={(event) => pressStart()}> START </button>
                        <button className="button wide-button" type="button" onClick={(event) => pressAbout()} > ABOUT</button>
                        <button className="button wide-button" type="button" onClick={(event) => pressTutorial()}> TUTORIAL </button>
                        <button className="button wide-button" type="button" onClick={(event) => pressMootingResources()}>MOOTING RESOURCES</button>
                        <button className="button wide-button buttonFeedback" type="button" onClick={(event) => pressFeedback()}>
                            <a className="button wide-button buttonFeedback" href=" https://ubc.ca1.qualtrics.com/jfe/form/SV_2l3a4rVJhxIcKeq" target="_blank">GIVE FEEDBACK</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>}


        {<div className="stayhidden" id="Position">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Position</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <div className="buttonFlexBox buttonFlexBox-Position">
                        <button className="button wide-button" type="button" onClick= {pressAppellant} >Appellant</button>
                        <button className="button wide-button" type="button" onClick={pressRespondent}>Respondent</button>
                    </div>
                </div>
                <div className="sideMenuBottom">
                    <button className="button wide-button" type="button" onClick={(event) => pressBackToMenu4()}>Back to Menu</button>
                </div>
            </div>
        </div>}

        {<div className="stayhidden" id="SetUp">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Setup</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <div className="buttonFlexBox">
                    <button className="button wide-button" type="button" onClick={(event) => pressCustomize()}>Customize</button> 
                    </div>
                    <div className="sideMenuContents" >
                        <p style={{fontSize: '22px'}}>This allows you to customize specific timer functions and questions that will be asked. </p>
                        <p>This includes: </p>
                        <ul>
                            <li>Adjusting total time, introduction time and Intervals </li>
                            <li> Randomizing or delaying questions </li>
                            <li>Adding custom questions and captions</li>
                        </ul>
                    </div>           
            <div className="hr-2"></div>
                <div className="buttonFlexBox">
                    <button className="button wide-button" type="button" onClick={pressDefault}>Default</button>
                    </div>
                <div className=" ">
                    <p style={{fontSize: '22px'}}> Default set up includes: </p>
                    <ul>
                        <li>Total duration: 25 min </li>
                        <li>Introduction time: 2 min 30 sec </li>
                        <li>Interval: 5 min </li>
                        <li>Approximate time between when questions will be asked</li>
                        <li>No randomized questions</li>
                    </ul>
                </div>
                </div>
                <div className="sideMenuBottom">
                    <button className="button large-button" type="button" onClick={(event) => pressBackFromSetup()}>Back</button>
                    {/*pressNextFromSetup function not needed as other options are presented*/}
                </div>
            </div>
        </div>}

        {<div className="stayhidden" id="Questions">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Questions</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuSetUp">
                    <div className="formitem">
                        <label htmlFor="Interval" >Interval</label>
                        <input id="interval-field" name="Interval" type="number" min="1" defaultValue="5" onChange={setInterval} ></input>
                        <div className="FieldDescription">minutes</div>
                        <p>Approximate time between when questions will be asked</p>
                    </div>
                    <div className="formitem">
                        <div className="label-wrapper">
                            <label htmlFor="Randomize">Randomize</label>
                        </div>
                        <div className="toggle-container" >
                            <input type="checkbox" id="setrandomizeQuestions" onChange={setRandomizeQuestions} />
                            <div className="slider round"></div>
                        </div>
                        <div className="FieldDescription"></div>
                        <p>Randomize the questions that will be asked</p>
                    </div>
                    <div className="formitem">
                        <label htmlFor="Interval">Delay</label>
                        <div className="toggle-container">
                            <input name="Interval" type="checkbox" id="setDelay" onChange={setDelay} />
                            <div className="slider round"></div>
                        </div>
                        <div className="FieldDescription"></div>
                        <p>Delay the next question for another interval</p>

                    </div>
                </div>
                <div className="sideMenuBottom">
                    <button className="button large-button" type="button" onClick={(event) => pressBackFromQuestions()}>Back</button>
                    <button className="button large-button" type="button" onClick={(event) => pressNextFromQuestions()}>Next</button>
                </div>
            </div>
        </div>}

        {<div className="stayhidden" id="Timer">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Timer</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuSetUp">
                    <div className="formitem">
                        <label htmlFor="TotalDuration">Total duration</label>
                        <input type="number" min="1" defaultValue="25" id="settotalTime" onChange={setTotalTime}></input>
                        <div className="FieldDescription">minutes</div>
                        <p style={{ fontSize: '18px',  marginTop: '5px', lineHeight: '1' }}>Set the total time of your court session. </p>
                    </div>
                    {/* <div className="formitem">
                        <div className="number-input-container">
                            <button type="button" className="button-decrement" data-input-id="hue" data-operation="decrement"></button>
                            <div className="number-input">
                                <input type="number" id="hue" name="hue" className="number-input-text-box" value="180" min="0" max="360" data-step="30" />
                            </div>
                            <button type="button" className="button-increment"  data-input-id="hue" data-operation="increment"></button>
                        </div>
                    </div> */}
                    <div className="formitem">
                        <label htmlFor="StopPresentation">Stop presentation</label>
                        <div className="toggle-container">
                            <input name="StopPresentation" type="checkbox" defaultChecked={true} id="setStopPresentation" onChange={setStopPresentation}/>
                            <div className="slider round"></div>
                        </div>
                        <div className="FieldDescription"></div>
                            <p style={{ fontSize: '18px',  marginTop: '5px', lineHeight: '1' }}>At the end of your session, you may extend your time if needed. </p>
                    </div>
                    <div className="formitem long-formitem" style={{marginBottom:'50px'}}>
                        <label htmlFor="IntroductionTime" style={{ marginBottom: '-15px' }}>Introduction time</label>
                        <div className="FieldDescription"></div>
                            <p style={{ fontSize: '18px', marginTop:'-20px', lineHeight: '0'}}>Set the introduction time of your court session. </p>
                        <div className="subformitem">
                            <input name="IntroductionTime" type="number" min="1" defaultValue="2" id= "setIntroductionMinutes" onChange={setIntroductionMinutes}></input>
                            <div className="FieldDescription">minutes</div>
                        </div>
                        <div className="subformitem" style= {{marginTop: '10px'}}>
                            <input name="MinutesTime" type="number" min="1" defaultValue="30" id="setIntroductionSeconds" onChange={setIntroductionSeconds}></input>
                            <div className="FieldDescription">seconds</div>
                        </div>
                    </div>
                </div>
                <div className="sideMenuBottom">
                    <button className="button large-button" type="button" onClick={(event) => pressBackFromTimer()}>Back</button>
                    <button className="button large-button" type="button" onClick={startApp}>Start Mooting!</button>
                </div>
            </div>
        </div>}

        {<div className="stayhidden" id="About">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>About</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <p>Judicial Interrogatory Simulator, also previously known as Moot Court, is a virtual practice space for mooting by yourself</p>
                    <p> This provides you both the personal space to practice with a set time and pace or as an Artificial intelligence tool, where you can practice your moot court with an OpenAI. </p>
                    <p> You can customize the settings according to your needs through the menu. </p>
                    <p> If you want to learn more about Judicial Interrogatory Simulator, check out the EML website: </p>
                    <p style={{fontSize: '25px', textAlign: 'center'}}> <a href="https://eml.ubc.ca/projects/judicial-interrogatory-simulator/" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Judicial Interrogatory Simulator </a></p>
                
                </div>
                <div className="sideMenuBottom">
                    <button className="button wide-button" type="button" onClick={(event) => pressBackToMenu()}>Back to Menu</button>
                </div>
            </div>
        </div>}


        {<div className="stayhidden" id="Tutorial">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Tutorial</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <ol>
                        <li> Click Start to choose your difficulty level for your Moot Court session</li>
                        <li> You may choose to either go to the default or customize your moot court session.</li>
                        <li> During your mooting, you may pause the timer by clicking on the button on the bottom right corner, or return to home page by clicking on button the left corner</li>
                        <li> At the end of your session, you may choose to restart or look at your assessment of your mooting.</li>
                        <p style={{marginTop: '35px', textAlign: 'center'}}> OPTIONAL: Once you’ve experienced JIS, please leave any feedback on your experience!</p>
                    </ol>
                </div>
                <div className="sideMenuBottom">
                    <button className="button wide-button" type="button" onClick={(event) => pressBackToMenu2()}>Back to Menu</button>
                </div>
            </div>
        </div>}

        {
            <div className="stayhidden" id="MootingResources">
                <div className="sideMenuInner">
                    <div className="sideMenuTitleText">
                        <h1>Resources</h1>
                        <div className="hr-2"></div>
                    </div>
                    <div className="sideMenuContents">
                        <a className="button large-button" href="./pdf/First-Year Moots Procedure Checklist (2023).pdf" target="_blank">First Year Moot Procedure Checklist</a>
                        <a className="button large-button" href="./pdf/Compiled Moot Resources.pdf" target="_blank">General Mooting Tips and Argument Criteria</a>
                        <a className="button large-button" href="./pdf/2021_Appearing_before_the_Court.pdf" target="_blank">Appearing before Court</a>
                    </div>
                    <div className="sideMenuBottom">
                        <button className="button" type="button" onClick={(event) => pressBackToMenu3()}>Back to Menu</button>
                    </div>
                </div>
            </div>
        }
    </>
}

export default LandingPageMenu;
