import React, { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

function ChatGPT() {
  const [response, setResponse] = useState(null);
  const apiKey = "Put Key Here";

  useEffect(() => {
    async function fetchResponse() {
      const configuration = new Configuration({
        apiKey: apiKey,
      });

      const openai = new OpenAIApi(configuration);

        const completion = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: 'Hello OpenAI:',
          temperature: 0.9,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.6,
          stop: ['You:', 'AI:'],
        });


        console.log(completion);

        if (completion.choices && completion.choices.length > 0) {
            const newResponse = completion.choices[0]?.text || '';
            setResponse(newResponse);
          } 
        }

    fetchResponse();
  }, []);

  useEffect(() => {
    console.log(response); // Print the response whenever it changes
    console.log("hello")
  }, [response]);

  if (response === null) {
    return <p>Loading...</p>;
    console.log(" response is null")
  }

  return <p>{response ? response : 'Loading...'}</p>;
}

export default ChatGPT;
