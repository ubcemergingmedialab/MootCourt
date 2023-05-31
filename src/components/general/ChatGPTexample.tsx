import {useEffect, useState} from 'react';
import { SpeechAnalytics } from "./SpeechAnalytics";

/*
PI's should take into consideration that chatGPT stores data
https://privacymatters.ubc.ca/privacy-impact-assessment
*/

function ChatGPT(input: object, configuration: object){
    const response = "ChatGPT: I am judge";
    console.log("ChatGPT Called");
    return response;
}

function getChatGPTResponse(prompt: string){

    const messages = [
        { role: 'system', content: 'You are a judge.' },
        { role: 'user', content: 'I am giving my case.' },
        { role: 'assistant', content: 'You will be a great laywer.' },
        { role: 'user', content: 'Really?' },
      ];

    // Need to store a history to keep memory of massages and append both the responses and new user prompts

    function countTokens(input: string){
        //https://docs.openai.com/api/ find counting method
        return 0;
    }

    
    let totalTokens = 0;
    const messageInputs = messages.map((message) => {
        totalTokens += countTokens(message.content);
        return message;
    });

    const config = {
        apiKey: "",
        model: "",
        temperature: 0.6, // consistent 0-1 random 
        // Max tokens needs to be input tokens + the amount that chatGPT can respond
        maxTokens: totalTokens + 50
    }

    const response = ChatGPT(messageInputs, config);

    return response;
}

export default function ChatGPTAttach(){
    const [keyPressed, setkeyPressed] = useState();
    const [keyPressedCount, incrementKeyPressedCount] = useState(0);

    const [chatResponse, setChatResponse] = useState("");

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
    
    const speechData = SpeechAnalytics(10, 10);

    useEffect(() => {
        
        // Get response on enter pressed
        if(keyPressed == "Enter"){
            const responseOnDemand = getChatGPTResponse(speechData.prompt);
            console.log("ChatGPT Response Received: ", responseOnDemand);
        }

    }, [keyPressedCount]);
    
    return(null);
}