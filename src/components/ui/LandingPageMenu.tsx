import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import PropTypes from 'prop-types'
import './LandingPage.css';

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


function pressAppellant() {
    resetDisplayedUI("Position", "SetUp");
}


function pressRespondant() {
    resetDisplayedUI("Position", "SetUp");
}


function pressCustomize() {
    resetDisplayedUI("SetUp", "Questions");
}


function pressDefault() {
    resetDisplayedUI("SetUp", "Main");
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


function pressBackFromQuestions() {
    resetDisplayedUI("Questions", "SetUp");
}


function pressNextFromQuestions() {
    resetDisplayedUI("Questions", "Timer");
}


function pressBackFromTimer() {
    resetDisplayedUI("Timer", "Questions");
}


function pressStartMooting() {
    resetDisplayedUI("Timer", "Main");
}

function LandingPageMenu({ updateAppState}) {

    // AppState : const Scene = 1

    return <>
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
                        <button className="button wide-button buttonFeedback" type="button" onClick={(event) => pressFeedback()}>GIVE FEEDBACK</button>
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
                        <button className="button wide-button" type="button" onClick={(event) => pressAppellant()} >Appellant</button>
                        <button className="button wide-button" type="button" onClick={(event) => pressRespondant()}>Respondent</button>
                    </div>
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
                    <button className="button wide-button" type="button" onClick={(event) => updateAppState(1)}>Default</button>
                    </div>
                </div>
            </div>
        </div>}

        {<div className="stayhidden" id="Questions">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>Questions</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <div className="formitem">
                        <label htmlFor="Interval">Interval</label>
                        <input name="Interval" type="number" min="1"></input>
                        <div className="FieldDescription">minutes</div>
                    </div>
                    <div className="formitem">
                        <label htmlFor="Randomize">Randomize</label>
                        <div className="toggle-container">
                            <input type="checkbox" />
                            <div className="slider round"></div>
                        </div>
                    </div>
                    <div className="formitem">
                        <label htmlFor="Interval">Interval</label>
                        <div className="toggle-container">
                            <input name="Interval" type="checkbox" />
                            <div className="slider round"></div>
                        </div>
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
                <div className="sideMenuContents">
                    <div className="formitem">
                        <label htmlFor="TotalDuration">Total duration</label>
                        <input type="number" min="1"></input>
                        <div className="FieldDescription">minutes</div>
                    </div>
                    <div className="formitem">
                        <label htmlFor="FirstWarning">First warning</label>
                        <input type="number" min="1"></input>
                        <div className="FieldDescription">minutes</div>
                    </div>
                    <div className="formitem">
                        <label htmlFor="SecondWarning">Second warning</label>
                            <input type="number" min="1"></input>
                        <div className="FieldDescription">minutes</div>
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
                            <input name="StopPresentation" type="checkbox" />
                            <div className="slider round"></div>
                        </div>
                    </div>
                    <div className="formitem long-formitem">
                        <label htmlFor="IntroductionTime">Introduction time</label>
                        <div className="subformitem">
                            <input name="IntroductionTime" type="number" min="1"></input>
                            <div className="FieldDescription">minutes</div>
                        </div>
                        <div className="subformitem">
                            <input name="MinutesTime" type="number" min="1"></input>
                            <div className="FieldDescription">seconds</div>
                        </div>
                    </div>
                </div>
                <div className="sideMenuBottom">
                    <button className="button large-button" type="button" onClick={(event) => pressBackFromTimer()}>Back</button>
                    <button className="button large-button" type="button" onClick={(event) => pressStartMooting()}>Start Mooting!</button>
                </div>
            </div>
        </div>}

        {<div className="stayhidden" id="About">
        <   div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>About</h1>
                    <div className="hr-2"></div>
                </div>
                <div className="sideMenuContents">
                    <p>Moot Court is a virtual practice space for mooting by yourself. </p>
                    <p>You can customize the settings according to your needs through the menu.</p>
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
                        <li>Click Start to SetUp and click the customization options in a guided process.</li>
                        <li>You can do default or customize the timer and questions before starting.</li>
                        <li>Pause the timer in the bottom right corner</li>
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
                        <p>Coming Soon! Or until I can locate the file</p>
                    
                        <button className="button large-button" type="button">
                            <a href="./pdf/First-Year Moots Procedure Checklist 2020.pdf">First Year Moot Procedure Checklist</a>
                        </button>
                        <button className="button large-button" type="button">
                            <a href="./pdf/Compiled Moot Resources.pdf">General Mooting Tips and Oral Argument Criteria</a>
                        </button>
                        <button className="button large-button" type="button">
                            <a href="./pdf/2021_Appearing_before_the_Court.pdf">Appearing before the Court (Civil and Criminal)</a>
                        </button>
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
