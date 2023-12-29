import {Html} from "@react-three/drei";
import React, {useEffect, useRef, useState} from "react";
import Recorder from "../general/Recorder";
import {createModel, KaldiRecognizer, Model} from 'vosk-browser';

interface PushToTalkProps {
    onStartPushToTalk: () => void;
    onStopPushToTalk: (audioBlob: Blob) => void;
    elapsedTime: number;
}

const PushToTalk = ({onStartPushToTalk, onStopPushToTalk, elapsedTime} : PushToTalkProps) =>
{
    const [isEnterHeld, setEnterHeld] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recorder = useRef<Recorder | null>(null);

    useEffect(() => {
       recorder.current = new Recorder();
       return () => {
           if (recorder.current)
           {
               recorder.current.cleanup();
           }
       }
    }, []);

    const handleKeyDown = (event) => {
        if (event.key !== 'Enter')
        {
            return;
        }

        setEnterHeld(true);
        if (!isRecording)
        {
            setIsRecording(true);
        }
    };

    const handleKeyUp = (event) => {
        if (event.key !== 'Enter')
        {
            return;
        }

        setEnterHeld(false);
        setIsRecording(false);
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
        if (!recorder.current)
        {
            console.error("Did you instantiate recorder?");
            return;
        }

        if (isEnterHeld)
        {
            recorder.current.startRecording();
            onStartPushToTalk();
        }else
        {
            if (recorder.current.mediaRecorder)
            {
                recorder.current.stopRecording();
            }
            onStopPushToTalk(recorder.current.getRecording());
        }
    }, [isEnterHeld]);

    return (
        <div></div>
    );
}

//----------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------
interface VoskResult {
    result: Array<{
        conf: number;
        start: number;
        end: number;
        word: string;
    }>;
    text: string;
}

function AudioComponent({config, appPaused, onTranscriptChange, elapsedTime})
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

    const [userInput, setUserInput] = useState('');
    const [micIcon, setMicIcon] = useState<JSX.Element>(micMute);
    const [loadedModel, setLoadedModel] = useState<{ model: Model; }>();
    const [recognizer, setRecognizer] = useState<KaldiRecognizer>();
    const [resultIndex, setResultIndex] = useState(0);

    const conversation = useRef<Array<any>>([]);
    const runningTimestamps = useRef<Array<any>>([]);

    useEffect(() => {
        const loadModel = async () =>
        {
            loadedModel?.model.terminate();
            const currentURL = window.location.href;
            // Note: To enable logs from vosk-browser, change the second parameter of createModel to 0
            const model = await createModel(`${currentURL}models/vosk-model-small-en-us-0.15.tar.gz`, -1);

            setLoadedModel({model});

            const newRecognizer = new model.KaldiRecognizer(48000);
            newRecognizer.setWords(true);

            newRecognizer.on("result", (message: any) => {
                setUserInput(message.result.text);
                const result: VoskResult = message.result;
                for (let index = resultIndex; index < result.result.length; index++)
                {
                    const res = message.result.result[index];
                    const word = res.word;
                    const startTimeInMS = res.start * 1000;

                    sendToAssessment(word, startTimeInMS);
                    setResultIndex(resultIndex + 1);
                }
            });

            setRecognizer(newRecognizer);
        };

        loadModel();

        return () => {
            if (loadedModel && loadedModel.model) {
                loadedModel.model.terminate();
            }
        };
    }, []);

    const handleStartPTT = () => {
        setMicIcon(micNormal);
    };

    const handleStopPTT = async (audioBlob: Blob) => {
        if (!audioBlob || audioBlob.size <= 0) {
            return;
        }

        if (!recognizer)
        {
            console.error("Did you instantiate the speech recognizer?");
            return;
        }

        recognizer.acceptWaveform(await blobToAudioBuffer(audioBlob));
        recognizer.retrieveFinalResult();

        setMicIcon(micMute);
    };

    useEffect(() => {
        if (userInput.length > 0)
        {
            onTranscriptChange(userInput);
        }
    }, [userInput]);

    const sendToAssessment = (transcript, startTime) =>
    {
        runningTimestamps.current.push([transcript, startTime]);
        config.runningTimestamps = runningTimestamps.current;
        conversation.current = createConversation(conversation.current, 'user', transcript);
        config.conversation = conversation.current;
    }

    return (
        <Html fullscreen>
            {!appPaused && (
                <PushToTalk onStartPushToTalk={handleStartPTT} onStopPushToTalk={handleStopPTT} elapsedTime={elapsedTime}></PushToTalk>)
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

/**
 * Creates a new message and appends it to the conversation
 * @param conversation List of OpenAI conversation messages
 * @param role One of 'user', 'assistant', 'system'
 * @param content The message to be appended
 * @returns List of OpenAI conversation messages
 */
function createConversation(conversation: Array<object>, role: string, content: string): Array<any> {
    let message = {role: role, content: content};
    let messages = [...conversation]
    messages.push(message);
    return messages;
}

async function blobToAudioBuffer(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new window.AudioContext;
    return audioContext.decodeAudioData(arrayBuffer);
}