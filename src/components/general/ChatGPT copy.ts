import React, { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai'
import * as openai from 'openai';

function ChatGPT(messageInputs: Array<openai.ChatCompletionRequestMessage>) {
  const blankResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: ""};
  const errorResponse: openai.ChatCompletionResponseMessage = {role: openai.ChatCompletionResponseMessageRoleEnum.System, content: "!ChatGPT did not respond correctly!"};
  const [response, setResponse] = useState(blankResponse);
  const apiKey = "";

  useEffect(() => {
    async function fetchResponse() {
      const configuration = new Configuration({
          apiKey: apiKey,
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

      const openai = new OpenAIApi(configuration);
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messageInputs,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
        stop: ['You:', 'AI:'],
      });

      
      if (completion.data.choices && completion.data.choices.length > 0) {
          const newResponse = completion.data.choices[0]?.message || errorResponse;
          setResponse(newResponse);
        } 
    }

  fetchResponse();
  
  }, []);

  useEffect(() => {
    console.log(response); // Print the response whenever it changes
    console.log("hello");
  }, [response]);

  return(null);
}

export default ChatGPT;