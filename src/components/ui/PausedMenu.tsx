import React from 'react';
import './PausedMenu.css';
import './AssessmentPage';
import {displayConversationValue} from './EndPageMenu';

 

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
                updateAppState(3);
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

    const Transcript = () => {
        resetDisplayedUI('paused-menu-buttons', 'paused-menu-transcript');
        const conversationValue = displayConversationValue(config={config});
    };

    const BackFromTutorial = () => {
        resetDisplayedUI('paused-menu-tutorial', 'paused-menu-buttons');
    };

    const BackFromTranscript = () => {
        resetDisplayedUI('paused-menu-transcript', 'paused-menu-buttons');
    };


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
            Transcript
            </button>
            <button className="button paused-menu-buttons" type="button" onClick={() => resetDisplayedUI('pausedmenucontents', 'paused-menu-tutorial')}>
            Tutorial
            </button>
            <button className="button paused-menu-buttons" type="button" onClick={SetUp}>
            Restart
            </button>
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
                {displayConversationValue(config={config})}

                <button className="button paused-menu-buttons" type="button" onClick={() => resetDisplayedUI('paused-menu-transcript', 'pausedmenucontents')}>
                Back
                </button>
                </div> 
                <div id="paused-menu-transcript" style={{ display: 'none' }}>
                {displayConversationValue(config={config})}
                <button className="button large-button" type="button" onClick={BackFromTranscript}>
                    Back
                </button>
            </div>
        </div>
    );
};


export default PausedMenu;

 