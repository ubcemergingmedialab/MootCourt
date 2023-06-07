import React from "react";
import {useCallback, useEffect, useState} from 'react';
import fs from 'fs';
import {Readable} from 'stream';
import { buffer } from "stream/consumers";

async function ServerRequestResponse(messages){

    const blankResponse = '';
    const errorResponse = '!Middle server request failed!';
    try {
        const response = await fetch('http://localhost:7000/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: messages
          }),
        });
        

        if (!response.ok) {
          throw new Error('Request failed');
        }
  
        return(response.arrayBuffer());
      } catch (error) {
        console.error(error);
        return(errorResponse);
      }
}

// ChatGPT runs asynchronously. This function waits and resolves to get a non-promise type.
function getResponse(messages: string, callback:any) {
    
    ServerRequestResponse(messages)
      .then(response => {
        callback(null, response);
      })
      .catch(error => {
        console.error(error);
        callback(error, null);
      });
}


async function playArrayBuffer(arrayBuffer) {
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  } catch (error) {
    console.error('Error playing audio:', error);
  }
}


function TexttoSpeech(text: string){

    const [audioFile, setAudioFile] = useState();
    const [keyPressed, setkeyPressed] = useState();
    const [keyPressedCount, incrementKeyPressedCount] = useState(0);

    useEffect(() => {
        const keyDownHandler = (e) => {
          //console.log("pressed key: " + e.key);
          setkeyPressed(e.key);
          incrementKeyPressedCount(keyPressedCount + 1);
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
          document.removeEventListener('keydown', keyDownHandler);
        };
    });

    useEffect(() => {

        // Get response on enter pressed
        if(keyPressed == 'Alt'){

            getResponse(text, (error:any, response:any) => {
              setAudioFile(response);
            });
        }

    }, [keyPressedCount]);


    useEffect(() => {

        //fs.writeFileSync('Testing_Audio_Get', audioFile);
        if(audioFile!=undefined){
          playArrayBuffer(audioFile);
        }

    }, [audioFile]);

    return(null);
}

export default TexttoSpeech