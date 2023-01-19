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
            <div className="sideMenuContents">
            <div className="sideMenuTitleText"> Moot Court
            <div className="hr-1"></div>
            </div>
            <div className="buttonFlexBox">
            <button className="button" type="button" id="Start" onClick={(event) => pressStart()}> START </button>
            <button className="button" type="button" onClick={(event) => pressAbout()} > ABOUT</button>
            <button className="button" type="button" onClick={(event) => pressTutorial()}> TUTORIAL </button>
            <button className="button" type="button" onClick={(event) => pressMootingResources()}>MOOTING RESOURCES</button>
            <button className="buttonFeedback" type="button" onClick={(event) => pressFeedback()}>GIVE FEEDBACK</button>
            </div>
            </div>
        </div>}

        {<div className="stayhidden" id="Position">
            <div className="sideMenuContents">
            <div className="sideMenuTitleText"> Position
            <div className="hr-2"></div>
            </div>
            <div className="buttonFlexBox-Position">
            <button className="button" type="button" onClick={(event) => pressAppellant()} >APPELLANT</button>
            <button className="button" type="button" onClick={(event) => pressRespondant()}>RESPONDENT</button>
            </div>
            </div>
        </div>}

        {<div className="stayhidden" id="SetUp">
            <div className="sideMenuContents">
            <div className="sideMenuTitleText"> Setup
            <div className="hr-2"></div>
            </div> 
            <div className="buttonFlexBox-Position">
            <button className="button" type="button" onClick={(event) => pressCustomize()}>Customize</button>
            <button className="button" type="button" onClick={(event) => updateAppState(1)}>Default</button>
            </div>
            </div>
        </div>}

        {<div className="stayhidden" id="Questions">
        <div className="sideMenuContents">
        <div className="sideMenuTitleText"> Questions
        <div className="hr-1"></div>
        </div> 
        <div className="questionPageGrid">
        <div className="gridLeftSide1">
            <div className="gridLeftSideText"> Interval </div>
        </div>
        <div className="gridLeftSide2">
            <div className="gridLeftSideText"> Randomize </div>
        </div>
        <div className="gridLeftSide3">
            <div className="gridLeftSideText"> Delay </div>
        </div>
        <div className="gridRightSide1">
            <input type="number" min="1"></input>
            <div className="gridLeftSideText"> Minutes </div>
        </div>
        <div className="gridRightSide2">
        <div className="toggle-container">
                <input type="checkbox" />
                <div className="slider round"></div>
            </div>
        </div>
        <div className="gridRightSide3">
        <div className="toggle-container">
                <input type="checkbox" />
                <div className="slider round"></div>
            </div>
        </div>
        <div className="gridLeftSide4">
        </div>
            </div>
            <button className="button" type="button" onClick={(event) => pressBackFromQuestions()}>Back</button>
            <button className="button" type="button" onClick={(event) => pressNextFromQuestions()}>Next</button>
        </div>
        </div>}

        
        {<div className="stayhidden" id="Timer">
            <div className="sideMenuInner">
                <h1> Timer </h1>
                <div className="formitem">
                    <label htmlFor="TotalDuration"> Total Durartion</label>
                    <div className="gridRightSide1">
                        <input type="number" min="1"></input>
                    </div>
                    <div className="FieldDescription">Minutes </div>
                </div>
                <div className="formitem">
                    <label htmlFor="FirstWarning" > First Warning </label>
                    <div className="gridRightSide1">
                        <input type="number" min="1"></input>
                    </div>
                    <div className="FieldDescription">Minutes </div>
                </div>
                <div className="formitem">
                    <label htmlFor="SecondWarning"> Second Warning </label>
                    <div className="gridRightSide1">
                        <input type="number" min="1"></input>
                    </div>
                    <div className="FieldDescription">Minutes </div>
                 </div>
                <label> Stop Presentation </label>
                <div className="toggle-container">
                    <input type="checkbox" />
                    <div className="slider round"></div>
                </div>
                <h2> Introduction Time </h2>
                <div className="gridRightSide1">
                    <input type="number" min="1"></input>
                </div>
                <h3>Minutes </h3>
                <div className="gridRightSide1">
                    <input type="number" min="1"></input>
                </div>
                <h3>Seconds </h3>

                <button className="button" type="button" onClick={(event) => pressBackFromTimer()}>Back</button>
                <button className="button" type="button" onClick={(event) => pressStartMooting()}>Start Mooting!</button>
            </div>
        </div>}

        {<div className="stayhidden" id="About">
            <br /> <h1>
            Moot Court is a virtual practice space for mooting by yourself. </h1>
            <br />
            <h1>
            You can customize the settings according to your needs through the menu.
                </h1>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressBackToMenu()}>Back to Menu</button>
        </div>}


        {<div className="stayhidden" id="Tutorial">
            <br /><h1>
            1. Click Start to SetUp and click the customization options in a guided process. </h1>
            <br /> <h1>
            2. You can do default or customize the timer and questions before starting. </h1>
            <br /> <h1>
            3. Pause the timer in the bottom right corner </h1>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressBackToMenu2()}>Back to Menu</button>
        </div>}

        {
            <div className="stayhidden" id="MootingResources">
                <br />
                <h1> Resources - Coming Soon! Or until I can locate the file </h1> <br /><br />
                <button className="button" type="button">
                    <a href="./pdf/First-Year Moots Procedure Checklist 2020.pdf">First Year Moot Procedure Checklist</a>
                </button>
                <button className="button" type="button">
                    <a href="./pdf/Compiled Moot Resources.pdf">General Mooting Tips and Oral Argument Criteria</a>
                </button>
                <button className="button" type="button">
                    <a href="./pdf/2021_Appearing_before_the_Court.pdf">Appearing before the Court (Civil and Criminal)</a>
                </button>

                <button className="button" type="button" onClick={(event) => pressBackToMenu3()}>Back to Menu</button>
            </div>
        }
    </>
}

export default LandingPageMenu;