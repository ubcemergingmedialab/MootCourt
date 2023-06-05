import React from "react";
import {useCallback, useEffect, useState} from 'react';
import { SpeechAnalytics } from "./SpeechAnalytics";
//import ChatGPT from "./ChatGPT";
import * as openai from 'openai';
import { Configuration, OpenAIApi } from 'openai'

/*
PI's should take into consideration that chatGPT stores data
https://privacymatters.ubc.ca/privacy-impact-assessment
*/



async function ChatGPT(messageInputs: Array<openai.ChatCompletionRequestMessage>) {

    const blankResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: ""};
    const errorResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: "!ChatGPT did not respond correctly!"};

    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_API_KEY
    });

    /*
    function countTokens(input: string){
        //https://docs.openai.com/api/ find counting method
        return 0;
    }

    // Tokens should probably be counted inside the ChatGPT componenet
    let totalTokens = 0;
    messages.map((message) => {
        totalTokens += countTokens(message.content);
        return message;
    });
    */

    const openaiProcess = new OpenAIApi(configuration);
    
    const completion = await openaiProcess.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messageInputs,
        temperature: 0.9,
        max_tokens: 30
    });

    
    if (completion.data.choices && completion.data.choices.length > 0) {
        const newResponse = completion.data.choices[0]?.message || errorResponse;
        return(newResponse);
    }

    return(blankResponse);
}

// ChatGPT runs asynchronously. This function waits and resolves to get a non-promise type.
function getResponse(conversation){
    const blankResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: ""};
    let resolvedResponse = blankResponse;
    
    ChatGPT(conversation)
    .then((response)=>{
        resolvedResponse = response;
    })
    // .catch((error: any) => {
    //     console.error(error);
    // })

    return resolvedResponse;
}


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
    const blankRequest: openai.ChatCompletionRequestMessage = {role: openai.ChatCompletionRequestMessageRoleEnum.System, content: ""};
    const blankConversation: Array<openai.ChatCompletionRequestMessage> = [];
    const [chatResponse, setChatResponse] = useState(blankResponse);
    const [conversation, setConversation] = useState(blankConversation);

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
        if(keyPressed == 'Enter'){
            setConversation(createConversation(speechData.prompt));
            console.log('Key Check: ', (''+process.env.REACT_APP_API_KEY).slice(0,5));
            /*
            ChatGPT appears to be working however the request is being denied because of an issue with user authentication due to this being run on the front end
            The API key will also be visible if this is run on the front end.
            It seems the best method would be to send data to our server (backend). The server gets a ChatGPT response and then provides that back to the user (front end)
            This will require the transcript to be temporarily stored on servers. Encryption and Decryption may be required for security.
            ChatGPT implementation should be moved to a server
            getResponse function should make requests of the server
            A simpler solution may be to find a workaround for the User agent error and to ask users to generate their own API key to use ChatGPT functions
            Check if calling it through a script like previously implemented could work
            */
            //setChatResponse(getResponse(conversation));
            console.log('ChatGPT Response Received: ', chatResponse);
        }

    }, [keyPressedCount]);
    
    return(null);
}