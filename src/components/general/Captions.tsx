import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { SpeechAnalytics } from "./SpeechAnalytics";

export default function Captions(){
    const speechData = SpeechAnalytics(10, 10);
    const spoken = speechData.prompt;
    //console.log(spoken);
    //currently this is using the user's speech as a test but should be set to the ChatGPT response
    return <>
        {<p> {spoken.slice(spoken.length-1000, spoken.length)} </p>}
    </>
}