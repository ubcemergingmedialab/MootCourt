import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { SpeechAnalytics } from "./SpeechAnalytics";

export default function Captions({config}){
    const speechData = SpeechAnalytics(10, 10);
    const spoken = "Prompt: " + speechData.prompt + "-------- Response: " + (config.ChatGPT || "");
    //console.log(spoken);
    //currently this is using the user's speech as a test but should be set to the ChatGPT response
    return <>
        {<p> {spoken.slice(spoken.length-2000, spoken.length)} </p>}
    </>
}