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

async function ServerRequestResponse(messages): Promise<openai.ChatCompletionResponseMessage>{

    const blankResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: ''};
    const errorResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: '!Middle server request failed!'};
    try {
        const response = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages
          }),
        });
        

        if (!response.ok) {
          throw new Error('Request failed');
        }
  
        const data = await response.json();
        return(data.message);
      } catch (error) {
        console.error(error);
        return(errorResponse);
      }
}

// ChatGPT runs asynchronously. This function waits and resolves to get a non-promise type.
function getResponse(messages: Array<openai.ChatCompletionRequestMessage>, callback:any) {

    ServerRequestResponse(messages)
      .then(response => {
        callback(null, response);
      })
      .catch(error => {
        console.error(error);
        callback(error, null);
      });
}


function createMessage(messageRole: string, messageContent: string){
        
    let setrole: openai.ChatCompletionRequestMessageRoleEnum;

    if(messageRole == 'assistant'){
        setrole = openai.ChatCompletionRequestMessageRoleEnum.Assistant
    } else if(messageRole == 'system'){
        setrole = openai.ChatCompletionRequestMessageRoleEnum.System
    } else if(messageRole == 'user'){
        setrole = openai.ChatCompletionRequestMessageRoleEnum.User
    } else{
        setrole = openai.ChatCompletionRequestMessageRoleEnum.User
    }

    const message: openai.ChatCompletionRequestMessage = {role: setrole, content: messageContent};

    return message;
}

function createConversation(conversation: Array<openai.ChatCompletionRequestMessage>, user: string, prompt: string){
    let message = createMessage(user, prompt);
    let messages = [...conversation]
    messages.push(message);
    return messages;
}

export default function ChatGPTAttach({updateConfig, config, setJudgeSpeechText}){
    const [keyPressed, setkeyPressed] = useState();
    const [keyPressedCount, incrementKeyPressedCount] = useState(0);

    const blankResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: ""};
    const blankRequest: openai.ChatCompletionRequestMessage = {role: openai.ChatCompletionRequestMessageRoleEnum.System, content: ""};
    const blankConversation: Array<openai.ChatCompletionRequestMessage> = [];

    const [chatResponse, setChatResponse] = useState(blankResponse);

    const systemPrompt = 'Play the role of a judge in a moot court. You will respond as a judge would. Use natural speech that would be used in a court but not provide unnecessary long responses. Consider the arguments of the appellant or respondent. As they speak a transcript will be provided to you containing information regarding their WPM and the [start-stop] time of speaking.'
    const initJudgeConversation  = createConversation(blankConversation, 'system', systemPrompt)
    const [conversation, setConversation] = useState(initJudgeConversation);

    const [lastSpeechUpdate, setLastSpeechUpdate] = useState(new Date().getTime());

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

    useEffect(()=>{
        const now = new Date().getTime();
        setLastSpeechUpdate(now);
    }, [speechData])


    function promptToConversation(){
        if(conversation[conversation.length-1].role != 'user'){

            let prompt = speechData.prompt
            if(conversation.length > 2){
                prompt = prompt.slice((conversation[conversation.length-2].content||"").length)
            }
            console.log(prompt)
            setConversation(createConversation(conversation, 'user', prompt));
        }
    }

    /*
    function CheckSpeechPause() {

        const now = new Date().getTime()
        const speechPause = now - lastSpeechUpdate;

        // Change prompt triggering ChatGTP if there is a pause in speech.
        const delay = 10 * 1000;
        console.log((delay-speechPause)>0);
        if((delay-speechPause)>0){
            //promptToConversation()
            console.log('ChatGPT regcognizes the pause: ', delay-speechPause);
            
        }

        // Check every 5s, does not have to be 5s
        setTimeout(CheckSpeechPause, 1000);
      }

    // Avoid Rerendering this self looping function
    useEffect(() => {
        CheckSpeechPause();
    },[]);*/
      

    useEffect(() => {
        
        // Get response on enter pressed
        if(keyPressed == 'Enter'){
            promptToConversation()
        }

    }, [keyPressedCount]);

    useEffect(() => {

        // Only get a response if the conversation has changed and it is by the user
        // Might casue issues if delelitions occure
        if(conversation[conversation.length-1].role == 'user'){
            // This changes the chatResponse which can later be detected. If you try to access the value of chatResponse continuously it may not be finshed.
            console.log('Calling ChatGPT');
            getResponse(conversation, (error:any, response:any) => {
                setChatResponse(response.choices[0].message);
            });
        }
        console.log('Conv: ', conversation)

    }, [conversation]);

    useEffect(() => {
        // There may be times where a blank response should be returned and this will not allow that
        // This is here to prevent setConversation to be called on the first frame when ChatResponse is intially set
        if(chatResponse != blankResponse){
            setConversation(createConversation(conversation, 'assistant', chatResponse.content));
            config.ChatGPT = chatResponse.content;
            updateConfig(config);
            
            setJudgeSpeechText(config.ChatGPT);
            //config.ChatGPTConversation = conversation;
            //updateConfig(config);
        }
    }, [chatResponse]);

    
    return(null);
}


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