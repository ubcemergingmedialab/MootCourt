import React from 'react';
import './PausedMenu.css';
import './AssessmentPage';
import displayConversationValue from './EndPageMenu';



interface PausedMenuProps {
  conversationElements: React.ReactElement[];
  // Other existing props...
}

const PausedMenu = ({ updateAppState, appPaused, togglePause, children }) => {
  const handleTogglePause = () => {
    togglePause();
  };

  const EndSession = () => {
    updateAppState(3);
  };

  const SetUp = () => {
    updateAppState(0);
  };

  const Tutorial = () => {
    resetDisplayedUI('paused-menu-buttons', 'paused-menu-tutorial');
  };

  const Transcript = () => {
    resetDisplayedUI('paused-menu-buttons', 'paused-menu-transcript');
    const conversationValue = displayConversationValue({
      updateAppState: updateAppState,
      updateConfig: null,
      config: null, 
    });
  };

 

  const BackFromTutorial = () => {
    resetDisplayedUI('paused-menu-tutorial', 'paused-menu-buttons');
  };

  const BackFromTranscript = () => {
    resetDisplayedUI('paused-menu-transcript', 'paused-menu-buttons');
  };

  const resetDisplayedUI = (buttonsID, tutorialID) => {
    const buttonsSection = document.getElementById(buttonsID);
    const tutorialSection = document.getElementById(tutorialID);

    if (buttonsSection && tutorialSection) {
      buttonsSection.style.display = 'none';
      tutorialSection.style.display = 'block';
    }
  };

  const style = {
    display: appPaused ? 'block' : 'none'
  };



  return (
    <div className="PausedMenu" style={style}>
      <h1>Paused</h1>
      <div id="paused-menu-buttons">
      <button className="button large-button" type="button" onClick={Transcript}>
          Transcript
        </button>
        <button className="button large-button" type="button" onClick={Tutorial}>
          Tutorial
        </button>
        <button className="button large-button" type="button" onClick={EndSession}>
          End The Session
        </button>
        <button className="button large-button" type="button" onClick={SetUp}>
          Restart
        </button>
        <button className="button large-button" type="button" onClick={handleTogglePause}>
          Continue Session
        </button>
        {children}
      </div>
      <div id="paused-menu-tutorial" style={{ display: 'none' }}>
        <ol>
              <li>Click "Start" to begin your moot court after choosing your difficulty level and position. The options you are provided are:
               <ul>
               <li><b>IntelliJudge:</b> AI judge whom you can communicate and get live-response in your moot session.  </li>
                 </ul>
                </li>
                  <li>In a guided process, you can choose to either go to the default or customize your moot court session in the settings.</li>
               <li>During your mooting, you may pause the timer by clicking on the bottom right corner, or return to home page by clicking on the left corner</li>
                <li>At the end of your session, you will be provided with an assessment of your mooting.</li>
        </ol>
        <button className="button large-button" type="button" onClick={BackFromTutorial}>
          Back
        </button>
      </div>
      <div id="paused-menu-transcript" style={{ display: 'none' }}>
      {/* {displayConversationValue({
      updateAppState: updateAppState,
      updateConfig:"",
      config: "",
    })} */}

               
        <button className="button large-button" type="button" onClick={BackFromTranscript}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PausedMenu;
