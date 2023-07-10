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
    resetDisplayedUI("Main", "Difficulty");
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

function pressTroubleShooting() {
    resetDisplayedUI("Main", "TroubleShooting");
}


function pressFeedback() {
    resetDisplayedUI("Main", "Feedback");
}


function pressBackToMenu() {
    resetDisplayedUI("About", "Main");
}

function pressBackFromDifficulty() {
    resetDisplayedUI("Difficulty", "Main");
}

function pressBackFromPosition() {
    resetDisplayedUI("Position", "Difficulty");
}

function pressBackFromTroubleShooting() {
    resetDisplayedUI("TroubleShooting", "Main");
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

    // const setDelay = () => {
    //     let checkBox = document.getElementById("setDelay") as HTMLInputElement
    //     updateConfig({...config, setDelay: checkBox.checked})
    // }

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

    const pressClassic = () => {
        resetDisplayedUI("Difficulty", "Position");
        updateConfig({...config, isInteliJudge: false})
        console.log("Classic enabled.")
    }
    
    const pressIntellaJudge = () => {
        resetDisplayedUI("Difficulty", "Position");
        updateConfig({...config, isInteliJudge: true})
        console.log("IntellaJudge enabled.")
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
                        <button className="button" type="button" onClick={(event) => pressTroubleShooting()}> Need Help? </button>

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
                    <button className="button wide-button" type="button" onClick={(event) => pressBackFromPosition()}>Back</button>
                </div>
            </div>
        </div>}

        {<div className="stayhidden" id="Difficulty">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Difficulty</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <div className="buttonFlexBox buttonFlexBox-Position">
                        <button className="button wide-button" type="button" onClick= {pressClassic} >Classic</button>
                        </div>
                    <div className="sideMenuContentsWithButtons">
                        <p>Practice your moot court by honing your speech delivery and time managment. </p>
                        <ul>
                            <li>  Under a given total time, you will be given set interval to provide your argument before asked a question. </li>
                        </ul>
                    </div>
            <div className="hr-3"></div>
                <div className="buttonFlexBox buttonFlexBox-Position">
                        <button className="button wide-button" type="button" onClick={pressIntellaJudge}>Intella-Judge</button>
                </div>
                    <div className="sideMenuContentsWithButtons">
                        <p>Practice your moot court with an OpenAI for live communication and custom AI-generated questions.</p>  
                        <ul>
                            <li>  Press “Enter” when you’re done speaking to hear the IntellaJudge’s response. </li>
                        </ul>
                    </div>
                </div>
                <div className="sideMenuBottom">
                    <button className="button wide-button" type="button" onClick={(event) => pressBackFromDifficulty()}>Back to Menu</button>
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
                    <div className="buttonFlexBox buttonFlexBox-Position">
                        <button className="button wide-button" type="button" onClick={(event) => pressCustomize()}>Customize</button>
                        {/* <button className="button wide-button" type="button" onClick={pressDefault}>Default</button> */}
                    </div>
                    <div className="sideMenuContentsWithButtons">
                        <p>Customization allows you to adjust the follwing: </p>
                            <ul>
                                <li>Adjusting total time, introduction time and Intervals</li>
                                <li>Randomizing or delaying questions</li>
                            </ul>
                    </div>
                <div className="hr-3"></div>            
                    <div className="buttonFlexBox buttonFlexBox-Position">
                        <button className="button wide-button" type="button" onClick={pressDefault}>Default</button>
                    </div>
                    <div className="sideMenuContentsWithButtons">
                        <p>In the default, these are the following features:</p>    
                            <ul> 
                                <li>Total duration: 25 min </li>
                                <li>Introduction time: 2 min 30 sec </li>
                                <li>Interval (Approximate time between questions): 5 min </li>
                                <li>No randomized questions</li>
                            </ul>
                    </div>
                </div>
                <div className="sideMenuBottom">                
                            <button className="button wide-button" type="button" onClick={(event) => pressBackFromSetup()}>Back</button>

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
                        <p style={{ fontSize: '18px', marginTop: '5px', lineHeight: '1', textAlign: 'left' }}>Approximate time between when questions will be asked</p>
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
                        <p style={{ fontSize: '18px', marginTop: '5px', lineHeight: '1', textAlign: 'left' }}>Randomize the questions that will be asked</p>
                    </div>
                    {/* <div className="formitem">
                        <label htmlFor="Interval">Delay</label>
                        <div className="toggle-container">
                            <input name="Interval" type="checkbox" id="setDelay" onChange={setDelay} />
                            <div className="slider round"></div>
                        </div>
                        <div className="FieldDescription"></div>
                        <p>Delay the next question for another interval</p>

                    </div> */}
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
                        <p style={{ fontSize: '18px', marginTop: '5px', lineHeight: '1', textAlign: 'left' }}>Set the total time of your court session. </p>
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
                            <p style={{ fontSize: '18px', marginTop: '5px', lineHeight: '1', textAlign: 'left' }}>At the end of your session, you may extend your time if needed. </p>
                    </div>
                    <div className="formitem " >
                        <label htmlFor="IntroductionTime" style={{ marginBottom: '-15px' }}>Introduction time</label>
                        <div className="FieldDescription"></div>
                            <p style={{ fontSize: '18px', marginTop: '5px', lineHeight: '1', textAlign: 'left' }}>Set the introduction time of your court session. </p>
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
                    <p>Judicial Interrogatory Simulator, also previously known as Moot Court, is a virtual practice space for mooting by yourself. </p>
                    <p>This provides you both the personal space to practice with a set time and pace or as an Artificial intelligence tool, where you can practice your moot court with an OpenAI.</p>
                    <p>You can customize the settings according to your needs through the menu. </p>
                    <p>If you want to learn more about Judicial Interrogatory Simulator, check out the EML website: <u>Judicial Interrogatory Simulator</u></p>
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
                        <li>Click "Start" to begin your moot court after choosing your difficulty level and position. The options you are provided are:
                            <ul>
                                <li>Classic: Automated judge that allows you to practice on your time management and speech delievry</li>
                                <li>IntellaJudge: AI judge whom you can communicate and get live-response in your moot session.  </li>
                            </ul>
                        </li>
                        <li>In a guided process, you can choose to either go to the default or customize your moot court session in the settings.</li>
                        <li>During your mooting, you may pause the timer by clicking on the bottom right corner, or return to home page by clicking on the left corner</li>
                        <li>At the end of your session, you will be provided with an assessment of your mooting.</li>
                    </ol>
                    <p><b>OPTIONAL</b>: Once you’ve experienced JIS, please leave any feedback on your experience!</p>
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
                        <button className="button wide-button" type="button" onClick={(event) => pressBackToMenu3()}>Back to Menu</button>
                    </div>
                </div>
            </div>
        }

{<div className="stayhidden" id="TroubleShooting">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Trouble Shooting</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <p>If you expirence the following:</p>
                    <ul>
                        <li>No audio sound</li>
                        <li>Audio cut off (Judge doesn’t complete sentence)</li>
                        <li>White screen</li>
                        <li>Frozen screen (Timer or judge isn’t moving)</li>
                    </ul>
                    <p>We recommend changing the browser to either <b>Firefox or Chrome</b>. You may also try changing your device.</p>
                    <p>If you continue experiencing issues or have a different problem that wasn’t listed above, please report the bug for us to resolve.</p>

                    <div className="buttonFlexBox buttonFlexBox-Position" >
                        <button className="button narrow-button buttonFeedback" type="button" onClick={(event) => pressFeedback()} >
                            <a className="button narrow-button buttonFeedback" href=" https://ubc.ca1.qualtrics.com/jfe/form/SV_bQpPxMLkx4ShRZk" target="_blank">REPORT BUGS HERE</a>
                        </button>
                    </div>

                </div>
                <div className="sideMenuBottom">
                    <button className="button wide-button" type="button" onClick={(event) => pressBackFromTroubleShooting()}>Back to Menu</button>
                </div>
                
                
            </div>
        </div>}
    </>
}

export default LandingPageMenu;
