import {useCallback, useEffect, useState} from 'react';
import { SpeechAnalytics } from "./SpeechAnalytics";
import ChatGPT from "./ChatGPT";
import * as openai from 'openai';

/*
PI's should take into consideration that chatGPT stores data
https://privacymatters.ubc.ca/privacy-impact-assessment
*/

function createConversation(prompt: string){

    function createMessage(messageRole: string, messageContent: string){
        
        let setrole: openai.ChatCompletionRequestMessageRoleEnum;

        if(messageRole == 'assistant'){
            setrole = openai.ChatCompletionRequestMessageRoleEnum.Assistant
        }
        if(messageRole == 'system'){
            setrole = openai.ChatCompletionRequestMessageRoleEnum.System
        }
        if(messageRole == 'user'){
            setrole = openai.ChatCompletionRequestMessageRoleEnum.User
        }
        else{
            setrole = openai.ChatCompletionRequestMessageRoleEnum.User
        }

        const message: openai.ChatCompletionRequestMessage = {role: setrole, content: messageContent};

        return message;
    }
    
    let systemMessage = createMessage('system', "You are a judge in a moot court. Do not provide a long response.");
    let message = createMessage('user', prompt);
    let messages: Array<openai.ChatCompletionRequestMessage> = [];
    messages.push(message);
    //messages.push(systemMessage);
    return messages;
}

export default function ChatGPTAttach(){
    const [keyPressed, setkeyPressed] = useState();
    const [keyPressedCount, incrementKeyPressedCount] = useState(0);

    const blankResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: ""};
    const [chatResponse, setChatResponse] = useState(blankResponse);

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
            const conversation = createConversation(speechData.prompt);

            const responseOnDemand = ChatGPT(conversation) || blankResponse;
            setChatResponse(responseOnDemand);

            console.log("ChatGPT Response Received: ", chatResponse);
        }

    }, [keyPressedCount]);
    
    return(null);
}