import React from 'react';
import './PausedMenu.css';
import './AssessmentPage';
import {displayConversationValue} from './AssessmentPage';

 

interface PausedMenuProps {
  conversationElements: React.ReactElement[];
  // Other existing props...
}

 

const PausedMenu = ({ updateAppState, appPaused, togglePause, children, config }) => {
    const handleTogglePause = () => {
        togglePause();
    };

    

    const EndSession = () => {
        const confirmRestart = window.confirm("You are about to end your session. This action will take you to the end page with the analyzed assessment from this session. Are you sure you want to proceed?");
            if(confirmRestart){
                updateAppState(0);
            }
        };

    const SetUp = () => {
        const confirmRestart = window.confirm("You are about to restart your session. This action will return you to the home page and any progress in this session will be lost. Are you sure you want to proceed?");
            if(confirmRestart){
                updateAppState(0);
            }
        };

    const Tutorial = () => {
        resetDisplayedUI('paused-menu-buttons', 'paused-menu-tutorial');
    };

    // const Transcript = () => {
    //     resetDisplayedUI('paused-menu-buttons', 'paused-menu-transcript');
    //     const conversationValue = displayConversationValue(config={config});
    // };

    const BackFromTutorial = () => {
        resetDisplayedUI('paused-menu-tutorial', 'paused-menu-buttons');
    };

    // const BackFromTranscript = () => {
    //     resetDisplayedUI('paused-menu-transcript', 'paused-menu-buttons');
    // };


    const resetDisplayedUI = (hideID, showID) => {
        const hideSection = document.getElementById(hideID);
        const showSection = document.getElementById(showID);

        if (hideSection && showSection) {
        hideSection.style.display = 'none';
        showSection.style.display = 'block';
        }
    };

    

    const style = {
        display: appPaused ? 'block' : 'none'
    };



    return (
        <div className="PausedMenu" style={style}>
        <h1>Paused</h1>
        <div className="hr-pause"></div>
        <div id="pausedmenucontents">
            <button className="button paused-menu-buttons" type="button" onClick={handleTogglePause}>
            Continue Session
            </button>
            <button className="button paused-menu-buttons" type="button" onClick={() => resetDisplayedUI('pausedmenucontents', 'paused-menu-transcript')}>
            Questions
            </button>
            <button className="button paused-menu-buttons" type="button" onClick={() => resetDisplayedUI('pausedmenucontents', 'paused-menu-tutorial')}>
            Tutorial
            </button>
            {/* <button className="button paused-menu-buttons" type="button" onClick={SetUp}>
            Restart
            </button> */}
            <button className="button paused-menu-buttons" type="button" onClick={EndSession}>
            End The Session
            </button>

            {children}
            </div>
            <div id="paused-menu-tutorial" style={{ display: 'none' }}>
            <ol>
                <li>Engage in your session and express yourself to the judge.
                    <ul>
                    <li><b>With IntelliJudge:</b> IntelliJudge will respond or may interupt during your session.  </li>
                    </ul>
                </li>
                <li>If you need to take a break, simply click the "Pause" button. To continue, press "Continue Session".</li>
                <li>Transcipt: Your conversation with the judge is being recorded in real-time. The transcript captures your session up to the point where you paused.</li>
                <li>To begin a new session, click "Restart or "Back to Menu.</li>
                <li>To end your session early, click "End Session.
                <ul>
                    <li> At the end of the session, you will receive a comprehensive assessment of your speech and performance. </li>
                    </ul>
                </li>
            </ol>
            <button className="button paused-menu-buttons" type="button" onClick={() => resetDisplayedUI('paused-menu-tutorial', 'pausedmenucontents')}>
            Back
            </button>
            </div>
            <div id="paused-menu-transcript" style={{ display: 'none' }}>
                {/*displayConversationValue(config={config})*/}
                <ul>
                    <li> Questions for Appellants:
                        <ol>
                            <li>The trial judge found that the store employee closed the door to the office and stood with his back to it. Can you explain me to why you say that didn't prevent the Respondent and his children from leaving? </li>
                            <li>Why do you say there was no psychological imprisonment in this case?</li>
                            <li>Can you please tell me where you are in your factum?</li>
                            <li>The evidence was that the store employee didn't intervene to avoid the problem when he saw that some of the grocery items hadn't been scanned. In light of that, I am troubled by finding the employee's conduct justified under s. 494(1). What do you have to say about that?</li>
                            <li>Shouldn't we be worried about giving private security personnel the power to detain members of the public whenever they want?</li>
                        </ol>
                    </li>
                    <li> Questions for Respondents:
                        <ol>
                            <li>Can you remind me what the trial judge's findings were regarding who pushed the shopping cart into the office near the Store exit? </li>
                            <li>Doesn't the fact that the Respondent and his children ultimately left the store on their own demonstrate that he always had that option open to him?</li>
                            <li>If the Respondent was on his way out of the store with goods he hadn't paid for, wasn't he in the process of committing an offence?</li>
                            <li>The trial judge concluded that s. 494(1)(b) did not apply. Can you tell us why you do or don't agree with that conclusion?  </li>
                            <li>Couldn't the Respondent have avoided the whole situation if he produced his receipt when he was first asked to do so?</li>
                        </ol>
                    </li>
                </ul>
               
                <button className="button paused-menu-buttons" type="button" onClick={() => resetDisplayedUI('paused-menu-transcript', 'pausedmenucontents')}>
                Back
                </button>
              </div> 
            {/*<div id="paused-menu-transcript" style={{ display: 'none' }}>
                {displayConversationValue(config={config})}
            </div>*/}
        </div>
    );
};


export default PausedMenu;

 