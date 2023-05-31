import {useEffect, useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

/*
May need a googleAPiKey for cross browser support
See: https://www.npmjs.com/package/react-hook-speech-to-text/v/0.1.0

Note that documentation should be included on the git page regarding installation of react-speech-recognition
npm install react-speech-recognition --force

Whisper API may be more accurate
*/

const Dictaphone = ({ handlePauseDetected }) => {
    let {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable,
    } = useSpeechRecognition();

    const [speechRecognitionObject, setSpeechRecognitionObject] = useState(null);
    const [triggerEffect, setTriggerEffect] = useState(false);
    const [addListener, setAddListener] = useState(false);
    const [repeatValue, incrementRepeatVal] = useState(0);

    let startListening = () => SpeechRecognition.startListening({ continuous: true });
    let value = null;

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            value = <span>Browser doesn't support speech recognition.</span>;
        }
        if (listening) {
            console.log(transcript);
        } else {
            setSpeechRecognitionObject(SpeechRecognition.getRecognition());
            startListening({ continuous: false });
            setAddListener(true);
        }
    }, []);

    useEffect(() => {
        console.log("transcript:", transcript);
    }, [transcript]);

    useEffect(() => {
        setAddListener(!addListener);
    }, [triggerEffect]);


    useEffect(() => {
        if (speechRecognitionObject != null)
        {
            console.log("Dictaphone event listeners initially added");
            speechRecognitionObject.addEventListener('speechstart', () => { console.log('speechstart:', repeatValue)});
            speechRecognitionObject.addEventListener('speechend', () => {
                incrementRepeatVal(repeatValue + 1);
                setTriggerEffect(!triggerEffect);
                console.log('speechend:', repeatValue);
            })
        } else {
            console.log("Dictaphone attempting to add event listener to null");
        }
    },[addListener]);

    return(null);
};
export default Dictaphone;