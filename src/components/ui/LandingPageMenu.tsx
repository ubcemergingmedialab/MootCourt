import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import PropTypes from 'prop-types'
import './LandingPage.css';


function pressStart() {
    const thisID = document.getElementById("Main");
    const nextID = document.getElementById("Position");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressAppellant() {
    const thisID = document.getElementById("Position");
    const nextID = document.getElementById("SetUp");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressRespondant() {
    const thisID = document.getElementById("Position");
    const nextID = document.getElementById("SetUp");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressCustomize() {
    const thisID = document.getElementById("SetUp");
    const nextID = document.getElementById("Questions");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressDefault() {
    const thisID = document.getElementById("SetUp");
    const nextID = document.getElementById("Main");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressAbout() {
    const thisID = document.getElementById("Main");
    const nextID = document.getElementById("About");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressTutorial() {
    const thisID = document.getElementById("Main");
    const nextID = document.getElementById("Tutorial");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressMootingResources() {
    const thisID = document.getElementById("Main");
    const nextID = document.getElementById("MootingResources");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressFeedback() {
    const thisID = document.getElementById("Main");
    const nextID = document.getElementById("Feedback");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressBackToMenu() {
    const thisID = document.getElementById("About");
    const nextID = document.getElementById("Main");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressBackToMenu2() {
    const thisID = document.getElementById("Tutorial");
    const nextID = document.getElementById("Main");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressBackToMenu3() {
    const thisID = document.getElementById("MootingResources");
    const nextID = document.getElementById("Main");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressBackFromQuestions() {
    const thisID = document.getElementById("Questions");
    const nextID = document.getElementById("SetUp");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressNextFromQuestions() {
    const thisID = document.getElementById("Questions");
    const nextID = document.getElementById("Timer");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressBackFromTimer() {
    const thisID = document.getElementById("Timer");
    const nextID = document.getElementById("Questions");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}


function pressStartMooting() {
    const thisID = document.getElementById("Timer");
    const nextID = document.getElementById("Main");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'pageBackground';
    }
}








function LandingPageMenu({ updateAppState }) {

    return <>
        {<div className="pageBackground" id="Main">
            <br />< br />
            <h1> Moot Court </h1>
            <hr className= "yellow_underline"></hr>
            <br />
            <button className="button" type="button" id="Start" onClick={(event) => pressStart()}> Start </button>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressAbout()} >About</button>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressTutorial()}>Tutorial</button>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressMootingResources()}>Mooting Resources</button>
            <br /><br />
            <button className="buttonFeedback" type="button" onClick={(event) => pressFeedback()}>Give us feedback?</button>
        </div>}

        {<div className="stayhidden" id="Position">
            <br />
            <h1> Position </h1>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressAppellant()} >Appellant</button>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressRespondant()}>Respondant</button>
            <br /><br />
        </div>}

        {<div className="stayhidden" id="SetUp">
            <br />
            <h1> SetUp </h1> <br /><br />
            <button className="button" type="button" onClick={(event) => pressCustomize()}>Customize</button>
            <br /><br />
            <button className="button" type="button" onClick={(event) => pressDefault()}>Default</button>
            <br /><br />
        </div>}

        {<div className="stayhidden" id="Questions">
            <br />
            <h1> Questions </h1> <br />
            <h2> Interval </h2> 
            <input type="text" value="default value"></input> <h3> Minutes </h3>
            <br />
            <h2> Randomize </h2>

            <div className="toggle-container">
                <input type="checkbox" />
                <div className="slider round"></div>
            </div>

            <br />
            <h2> Delay </h2>

            <div className="toggle-container">
                <input type="checkbox" />
                <div className="slider round"></div>
            </div>

            <br />

            <h2> Add </h2>
            <img src="./textures/Info.png"></img>
            <input type="text" value=""></input>
            <input type="text" value=""></input>
            <br />

            <button className="button" type="button" onClick={(event) => pressBackFromQuestions()}>Back</button>
            <button className="button" type="button" onClick={(event) => pressNextFromQuestions()}>Next</button>

        </div>}

        {<div className="stayhidden" id="Timer">
            <br />
            <h1> Timer </h1> <br /><br />
            <h2> Total Durartion</h2>
            <input type="text" value="default value"></input> <h3>Minutes </h3>
            <h2> First Warning </h2>
            <input type="text" value="default value"></input> <h3>Minutes </h3>
            <h2> Second Warning </h2>
            <input type="text" value="default value"></input> <h3>Minutes </h3>
            <h2> Stop Presentation </h2>
            <div className="toggle-container">
                <input type="checkbox" />
                <div className="slider round"></div>
            </div>
            <h2> Introduction Time </h2>
            <h3>Minutes </h3>
            <h3>Seconds </h3>

            <button className="button" type="button" onClick={(event) => pressBackFromTimer()}>Back</button>
            <button className="button" type="button" onClick={(event) => pressStartMooting()}>Start Mooting!</button>
 
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
                    <a href="First-Year Moots Procedure Checklist 2020.pdf" target="_blank">First Year Moot Procedure Checklist</a>
                </button>
                <button className="button" type="button">
                    <a href="Compiled Moot Resources.pdf" target="_blank">General Mooting Tips and Oral Argument Criteria</a>
                </button>
                <button className="button" type="button">
                    <a href="2021_Appearing_before_the_Court.pdf" target="_blank">Appearing before the Court (Civil and Criminal)</a>
                </button>

                <button className="button" type="button" onClick={(event) => pressBackToMenu3()}>Back to Menu</button>
            </div>

        }

    </>
}

export default LandingPageMenu;