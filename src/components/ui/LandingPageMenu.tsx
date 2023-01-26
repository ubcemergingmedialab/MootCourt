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

function incrementNumber(element) {
  element.parentNode.querySelector('input[type=number]').stepUp()
}

function decrementNumber(element) {
  element.parentNode.querySelector('input[type=number]').stepDown()
}

//minor issue with id and css
function setInterval() {
    /*if (document.getElementById("interval-field") != null) {
        if (document.getElementById("interval-field").value != null) {
            setquestionInterval(document.getElementById("interval-field").value * 1000 * 60);
        }
    }*/
}

function settingrandomizeQuestions() {
    //updateConfig.setrandomizeQuestions() = document.getElementById("setrandomizeQuestions").value;

   /* if (document.getElementById("").value != null) {
        if (document.getElementById("").value == false) {
            setrandomizeQuestions(true);
        } else false;
    }*/
}

function setDelay(updateConfig) {
  /*  var setDelayelement = document.getElementById("setStopPresentation");
    if (setDelayelement != null) {
        updateConfig('7' + setDelayelement)
    } */
}

function settotalTime() {
     //updateConfig.settotalTime() = document.getElementById("settotalTime").value * 1000 * 60;


}

function settingfirstWarning(updateConfig) {
   /* var firstwarningelement = document.getElementById("setfirstWarning");
    if (firstwarningelement != null) {
        //the value below should have firstwarningelment.value (but this input has issues)
        var firstwarningtimecalc = 1000 * 60;
        updateConfig('8' + firstwarningtimecalc.toString)
    }*/

}


function setsecondwarning(updateConfig) {
   /* var secondwarningelement = document.getElementById("setSecondWarning");
    if (secondwarningelement != null) {
        //the value below should have secondwarningelement.value (but this input has issues)
        var firstwarningtimecalc = 1000 * 60;
        updateConfig('9' + firstwarningtimecalc.toString)
    } */
}


function setStopPresentation(updateConfig) {
    /*var setStopPresentationelement = document.getElementById("setStopPresentation");
    if (setStopPresentationelement != null) {
        updateConfig('9' + setStopPresentationelement)
    }*/

}

function setIntroductionTime() {
    //updateConfig.setIntroductionTime() = (document.getElementById("setIntroductionMinutes").value * 1000 * 60) + (document.getElementById("setIntroductionSeconds").value * 1000);
}


function LandingPageMenu({ updateAppState, updateConfig}) {

    // AppState : const Scene = 1
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
                        <div className="increment-decrement-wrapper">
                            <input id="interval-field" name="Interval" type="number" min="1" defaultValue="5" onClick={(event) => setInterval()}></input>
                        </div>
                        <div className="FieldDescription">minutes</div>
                    </div>
                    <div className="formitem">
                        <div className="label-wrapper">
                            <label htmlFor="Randomize">Randomize</label>
                        </div>
                        <div className="toggle-container">
                            <input type="checkbox" id="setrandomizeQuestions" onClick={(event) => settingrandomizeQuestions()} />
                            <div className="slider round"></div>
                        </div>
                    </div>
                    <div className="formitem">
                        <label htmlFor="Interval">Delay</label>
                        <div className="toggle-container">
                            <input name="Interval" type="checkbox" id="setDelay" onClick={(event) => setDelay('7')} />
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
                        <input type="number" min="1" id="settotalTime" onClick={(event) => settotalTime()}></input>
                        <div className="FieldDescription">minutes</div>
                    </div>
                    <div className="formitem">
                        <label htmlFor="FirstWarning">First warning</label>
                        <input type="number" min="1" id="setfirstWarning" onClick={(event) => settingfirstWarning('8')} ></input>
                        <div className="FieldDescription">minutes</div>
                    </div>
                    <div className="formitem">
                        <label htmlFor="SecondWarning">Second warning</label>
                        <input type="number" min="1" id="setsecondwarning" onClick={(event) => setsecondwarning('9')}></input>
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
                            <input name="StopPresentation" type="checkbox" id="setStopPresentation" onClick={(event) => setStopPresentation('0')}/>
                            <div className="slider round"></div>
                        </div>
                    </div>
                    <div className="formitem long-formitem">
                        <label htmlFor="IntroductionTime">Introduction time</label>
                        <div className="subformitem">
                            <input name="IntroductionTime" type="number" min="1" id= "setIntroductionMinutes" onClick={(event) => setIntroductionTime()}></input>
                            <div className="FieldDescription">minutes</div>
                        </div>
                        <div className="subformitem">
                            <input name="MinutesTime" type="number" min="1" id="setIntroductionSeconds" onClick={(event) => setIntroductionTime()}></input>
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
            <div className="sideMenuInner">
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
                        <button className="button large-button" type="button">
                            <a href="./pdf/First-Year Moots Procedure Checklist 2020.pdf">First Year Moot Procedure Checklist</a>
                        </button>
                        <button className="button large-button" type="button">
                            <a href="./pdf/Compiled Moot Resources.pdf">General Mooting Tips and Argument Criteria</a>
                        </button>
                        <button className="button large-button" type="button">
                            <a href="./pdf/2021_Appearing_before_the_Court.pdf">Appearing before Court</a>
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
