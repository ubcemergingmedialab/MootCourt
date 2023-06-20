import React from 'react';
import './PausedMenu.css';

function resetDisplayedUI(ID1, ID2) {
    const thisID = document.getElementById(ID1);
    const nextID = document.getElementById(ID2);
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'sideMenuBackground';
    }
}

function pressTutorial() {
    resetDisplayedUI("Main", "Tutorial");
}

export default function PausedMenu( appPaused , { togglePause }){

    let display = 'block';
    if(!appPaused.appPaused){
        display = 'none';

    }

    const style = {
        display: display
    }

    return(
        <div className="PausedMenu" style={style}>
            <h1>PAUSED</h1>
            <div>
                <p>Repeat Question</p>
                <p>Return to Setup</p>
                <p>Tutorial</p>
                <button className="button large-button" type="button" onClick={(event) => { }}>CONTINUE SESSION</button>
            </div>
        </div>
    )

}