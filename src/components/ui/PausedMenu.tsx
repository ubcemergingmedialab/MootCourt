import React from 'react';
import './PausedMenu.css';

const PausedMenu = ({ appPaused, togglePause, children }) => {
  const handleTogglePause = () => {
    togglePause();
  };

  let display = appPaused ? 'block' : 'none';

  const style = {
            display: display
        }

  return (
    <div className="PausedMenu" style={style}>
      <h1>Paused</h1>
      <div>
      <button  className="button large-button" type="button" onClick={handleTogglePause}>Continue Session</button>
      {children}
      </div>
    </div>
  );
};

export default PausedMenu;