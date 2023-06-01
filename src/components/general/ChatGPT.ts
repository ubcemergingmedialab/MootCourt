import React, { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai'
import * as openai from 'openai';

function ChatGPT(messageInputs: Array<openai.ChatCompletionRequestMessage>) {
  const blankResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: ""};
  const errorResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: "!Response Failure!"};
  let response = blankResponse;

  const configuration = new Configuration({
    apiKey: process.env.API_KEY,
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


  async function fetchResponse(conversation) {
    try{
      const openai = new OpenAIApi(configuration);
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messageInputs,
        temperature: 0.6,
        max_tokens: 150
      });
    
    
      if (completion.data.choices && completion.data.choices.length > 0) {
        const newResponse = completion.data.choices[0]?.message || errorResponse;
        response = newResponse;
      }

    }catch (error) {
      console.error('Error occurred while fetching response:', error);
      response = errorResponse;
    }
  
  }

  fetchResponse(messageInputs);

  return(null);

}

export default ChatGPT;