import { useEffect, useState } from 'react'
import { Center, Html } from '@react-three/drei'
import PropTypes from 'prop-types'
import './LandingPage.css';
import defaultData from '../general/default_settings.json';
//import AssessmentPage from './AssessmentPage';
import './AssessmentPage.css';
import react, { ReactElement, ReactFragment } from 'react';
import * as d3 from 'd3';
import { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { findDOMNode } from 'react-dom';
import React from 'react';
import AssessmentPage from './AssessmentPage';



export default function EndPageMenu({updateAppState, updateConfig, config}) {
    // AppState : const Scene = 1
    // !!Inputs can come in the form of minutes, but config time is always stored as seconds!!

  
    const startApp = () => {
        const confirmRestart = window.confirm("You are about to end your session. This action will take you back to the start and you will no longer be able to see your assessment form. Are you sure you want to proceed?");
        if(confirmRestart){
            updateAppState(0);
        }
    }

    return (<>
        <AssessmentPage config={config} backButtonCallback={startApp}/>
    </>);
}

export function displayConversationValue({config}) {

    // Using the object to preserve the structure of the method without using react
    const displayConversation = {current: [<></>]};
    const conversation = {current: []};

    // Clear the elements
    displayConversation.current = [<></>];
    let lastRole = '';
  
    conversation.current = config.conversation || [];
    conversation.current.map((message: any)=>{

        console.log(message.role);
        // Do not add system messages
        if(message.role !== 'system'){

            // const currentTime = new Date();
            // let hours = currentTime.getHours();
            // const minutes = currentTime.getMinutes();
            // const seconds = currentTime.getSeconds();

            // let period = 'AM';
            // if(hours > 12){
            //     period = 'PM';
            // }
            // hours =  hours === 12 ? 12 : hours - 12;

            // let formattedHours = hours.toString();
            // const formattedMinutes = minutes.toString().padStart(2, '0');
            // //const formattedSeconds = seconds.toString().padStart(2, '0');

            // const timeString = `${formattedHours}:${formattedMinutes}${period}`;

            const name = `${message.role}-message`;
            const tag = `${message.role.toUpperCase()}: `;
            const block = <p className={name}>{tag}{message.content}</p>;
            displayConversation.current.push(block);
        }

        // Break line if it is from a different user
        if(message.role !== lastRole ){
            displayConversation.current.push(<><br></br></>);
        }

        lastRole = message.role;
    });

    return(<>
        <div className="inner-box">
            <div className="full-transcript-container">{displayConversation?.current}</div>
        </div>
    </>);
}
  
