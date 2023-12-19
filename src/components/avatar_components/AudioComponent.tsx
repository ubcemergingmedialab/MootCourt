import {Html} from "@react-three/drei";
import React, {useEffect, useRef, useState} from "react";
import Recorder from "../general/Recorder";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface PushToTalkProps {
    onStartPushToTalk: () => void;
    onStopPushToTalk: () => void;
}

const PushToTalk = ({onStartPushToTalk, onStopPushToTalk} : PushToTalkProps) =>
{
    const [isEnterHeld, setEnterHeld] = useState(false);
    //const [isRecording, setIsRecording] = useState(false);
    //const recorder = useRef<Recorder | null>(null);

    /*useEffect(() => {
       recorder.current = new Recorder();
       return () => {
           if (recorder.current)
           {
               recorder.current.cleanup();
           }
       }
    }, []);*/

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setEnterHeld(true);
            /*if (!isRecording)
            {
                setIsRecording(true);
            }*/
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === 'Enter')
        {
            setEnterHeld(false);
            //setIsRecording(false);
        }
    }
    useEffect(() =>
    {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () =>
        {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        /*if (!recorder.current)
        {
            console.error("Did you instantiate recorder?");
            return;
        }
        if (isRecording) {
            recorder.current.startRecording();
            onStartRecording();
            return;
        }

        if (recorder.current.mediaRecorder)
        {
            recorder.current.stopRecording();
            onStopRecording(recorder.current.getRecording());
        }*/
        if (isEnterHeld)
        {
            onStartPushToTalk();
        }else{
            onStopPushToTalk();
        }
    }, [isEnterHeld]);

    return (
        <div></div>
    );
}

//----------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------

function AudioComponent({appPaused, onTranscriptChange})
{
    //----------------------------------------------------------------------------------------------------------------------
    // TODO: Move these into one big asset file, consolidate the other assets in the project
    //----------------------------------------------------------------------------------------------------------------------
    const micNormal = <svg
        width="24px"
        height="24px"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="#000000">
        <rect x="9" y="2" width="6" height="12" rx="3" stroke="#000000" strokeWidth="1.5"/>
        <path d="M5 10v1a7 7 0 007 7v0a7 7 0 007-7v-1M12 18v4m0 0H9m3 0h3"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"/>
    </svg>

    const micMute = <svg
        width="24px"
        height="24px"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="#000000">
        <path d="M3 3l18 18M9 9v0a5 5 0 005 5v0m1-3.5V5a3 3 0 00-3-3v0a3 3 0 00-3 3v.5"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"/>
        <path d="M5 10v1a7 7 0 007 7v0a7 7 0 007-7v-1M12 18v4m0 0H9m3 0h3"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"/>
    </svg>

    //----------------------------------------------------------------------------------------------------------------------
    //
    //----------------------------------------------------------------------------------------------------------------------

    const {transcript, resetTranscript} = useSpeechRecognition();
    const [micIcon, setMicIcon] = useState<JSX.Element>();

    const handleStartPTT = () => {
        SpeechRecognition.startListening();
        resetTranscript();
        setMicIcon(micNormal);
    };

    const handleStopPTT = () => {
        SpeechRecognition.stopListening();
        onTranscriptChange(transcript);
        setMicIcon(micMute);
    };

    return (
        <Html fullscreen>
            {!appPaused && (
                <PushToTalk onStartPushToTalk={handleStartPTT} onStopPushToTalk={handleStopPTT}></PushToTalk>)
            }
            <div className='micIndicatorContainer' style={{
                backgroundColor: 'white',
                width: 'min-content',
                height: 'min-content',
                border: '2px solid black',
                borderRadius: '50px',
                position: 'absolute',
                marginLeft: '50vw',
                marginRight: '50vw',
                marginBottom: '50px',
                scale: '2',
                bottom: 0,
            }}>

                <div style={{
                    width: 'min-content',
                    height: 'min-content',
                    transform: 'translateY(2px)',
                    position: 'relative',
                    margin: 'auto',
                }}>

                    {micIcon}
                </div>
            </div>
        </Html>
    );
}
export default AudioComponent;