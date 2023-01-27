import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'
import PropTypes from 'prop-types'

import './Scene.css';


function goToScene() {
    const thisID = document.getElementById("Menu"); // hides menu and goes to main scene
    const nextID = document.getElementById("OpenMenu");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'alignright';
    }
}


function openMenu() {
    const thisID = document.getElementById("OpenMenu"); // open menu and hide this button
    const nextID = document.getElementById("Menu");
    if (thisID != null && nextID != null) {
        thisID.className = 'stayhidden';
        nextID.className = 'button_menu';
    }
}


function SceneMenu({ updateAppState }) {

    return <>
        {
            <div className="alignright" id="OpenMenu">
                <button className="button-out" type="button" onClick={(event) => openMenu()}>MENU</button>
            </div>
        }

        {
           <div className="stayhidden" id="Menu">
                <br />
                Menu
                <hr className="yellow_underline"></hr>
                <br />
                <button className="button" type="button" id="Menu->Customize" onClick={() => { updateAppState(0) }}>
                    Customize
                </button>
                <br />
                <br />
                <button className="button" type="button" id="Menu->Quit" onClick={() => updateAppState(0)}>
                    Quit
                </button>
                <br /><br />
                <button className="button" type="button" id="Menu->Cancel" onClick={(event) => goToScene()}>
                    Cancel
                </button>
            </div>

        }

    </>
}

export default SceneMenu;