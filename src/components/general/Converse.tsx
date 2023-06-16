import react from 'react';
import * as openai from 'openai';
import {Readable} from 'stream';
import React, { useState, useEffect } from 'react';

async function ServerRequestResponse(data: FormData, server){
    try {
        const response = await fetch(server, {
            method: 'POST',
            body: data
        });

        return(response);

    }catch (err) {
        console.error(err);
        return(undefined);
    }
}

// A single message with a role and content. In the future, the optional name could be added
function createMessage(messageRole: string, messageContent: string){
        
    let setrole: openai.ChatCompletionRequestMessageRoleEnum;

    if(messageRole === 'assistant'){
        setrole = openai.ChatCompletionRequestMessageRoleEnum.Assistant
    } else if(messageRole === 'system'){
        setrole = openai.ChatCompletionRequestMessageRoleEnum.System
    } else if(messageRole === 'user'){
        setrole = openai.ChatCompletionRequestMessageRoleEnum.User
    } else{
        setrole = openai.ChatCompletionRequestMessageRoleEnum.User
    }

    const message: openai.ChatCompletionRequestMessage = {role: setrole, content: messageContent};

    return message;
}

// Continue the previous conversation with a new message
function createConversation(conversation: Array<openai.ChatCompletionRequestMessage>, user: string, prompt: string){
    let message = createMessage(user, prompt);
    let messages = [...conversation]
    messages.push(message);
    return messages;
}

// Convert a dictionary into formData
function createFormData(options: any): FormData {
	const formData = new FormData();

	for (const key in options) {
		if (options.hasOwnProperty(key)) {
			formData.append(key, options[key]);
		}
	}

	return formData;
}

// Define a controllable recorder class
class Recorder {
    private mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
    private stream: MediaStream | null = null;

    async startRecording() {
            // Get microgpone access
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Get stream
            this.mediaRecorder = new MediaRecorder(this.stream);
            // Append data as it becomes available
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.chunks.push(event.data);
            });

        this.mediaRecorder.start(1000);
        console.log('recording started');
    }

    getRecording(): Blob {
        return new Blob(this.chunks, { type: 'audio/webm' });
    }

    async stopRecording() {
        if (!this.mediaRecorder){
            throw new Error('Recorder not initialized');
        }

        return new Promise<Blob>((resolve, reject) => {
            // ! Used to suppress ts check for null possibility
            // This is okay since we already checked if the recorder has been intialized
            // There might be a rare edgecase if the recorder is deleted after the check
            this.mediaRecorder!.addEventListener('stop', () => {

                if (this.stream) {
                    const tracks = this.stream.getTracks();
                    tracks.forEach((track) => track.stop());
                }

                const recordedBlob = new Blob(this.chunks, { type: 'audio/webm' });
                resolve(recordedBlob);

                // Clear the chunks stored in the recording object for the next recording
                this.chunks = [];
            });

            this.mediaRecorder!.stop();
            console.log('recording stopped');
        });
    }

    resumeRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive'){
            throw new Error('Recorder not started');
        }

        this.mediaRecorder.start();
        console.log('recording resumed');
    }

    pauseRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive'){
            throw new Error('Recorder not started');
        }

        this.mediaRecorder.pause();
        console.log('recording paused');
    }
}

let currentAudioSource; // It may be better to refactor in a more react like format
// This functionality should be moved to the top level on the APP
// Pass down the functions and or play source so that it can be controlled in the components
async function playArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
	try {
		const audioContext = new AudioContext();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);

		// Assign the new source to currentSource
		currentAudioSource = source;

		// Start the audio playback
		source.start();

	} catch (error) {
		console.error('Error playing audio:', error);
	}
}

export function cancel(): void {
    if (currentAudioSource) {
        // Stop the audio playback
        currentAudioSource.stop();
        console.log('Playback stopped');
        currentAudioSource = null;
    }
}

export async function Converse(conversation, recording){

    // Repetition every interval
    //const intervalId = setInterval(async ()=>{

        const recordingFile = new File([recording], 'user-recording', {
            type: 'audio/webm',
            lastModified: new Date().getTime()
        });

        const data = {
            // Audio recording in .webm format
            recording: recordingFile,
            // Prompt for whisper transcript style
            transcriptPrompt: 'Hello, I am here to present my case.',
            transcriptTemperature: 0.2,
            transcriptLanguage: 'en',

            // ChatGPT message history. The last message should not be a user message
            messages: JSON.stringify(conversation),
            chatTemperature: 0.2,
            max_tokens: 200,
            
            // Judge voice setting
            voice: 'en-US_EmmaExpressive',
            // Judge speaking rate percentage shift. It can be negative
            // ex 0 is normal, 100 is x2 speed
            ratePercentage: 0,
            // Judge pitch percentage shift. It can be negative
            // ex 0 is normal, 100 is double pitch ie higher (check this)
            pitchPercentage: 0
        };
        
        const formData = createFormData(data);
        const response = await ServerRequestResponse(formData, 'http://localhost:60/api/converse');
        if(response !== undefined){
            const responseJSON = await response.json();
            const getData = createFormData({ 'audioPath': responseJSON.audioPath });
            // Get the audio file from the path that was given in the response
            const audio = await ServerRequestResponse(getData, 'http://localhost:60/api/audio');
            console.log(responseJSON);
            console.log(audio);
            if(audio !== undefined){
                const arrayBuffer = await audio.arrayBuffer();
                console.log(arrayBuffer);
                playArrayBuffer(arrayBuffer);
            }

            return responseJSON;
        }



    //}, 10000);

    // Stop repetition after timeout
    // setTimeout(()=>{
    //     clearInterval(intervalId);
    // }, 60000);

    return null;
}

export default function ConverseAttach(){
    
    const blankConversation: Array<openai.ChatCompletionRequestMessage> = [];
    // SystemPrompt is the intial message that the conversation is prepoulated with to control ChatGPT's behavour
    // This should probably be part of the default settings in the JSON
    // It is possible to providing multiple system messages each with an intention is better than a large block
    // I believe that ChatGPT will read each and incorperate the instruction of each message somewhat seperately though considering the whole conversation
    // This might mean that distinct instructions should be seperated
    const systemPrompt = "You are an AI acting as a Judge in Canada in a Judicial Interrogation System practiced in the Socratic method and the user is orally presenting at a Moot Court practice. Find their weakest point and ask questions about that single idea to challenge, provoke thought, and deepen the student's understanding of law. Consider the arguments of the appellant or respondent. The transcript provided to you will contain information regarding their WPM and the [start-stop] time of speaking. Incorporate the emotions 'Nod,' 'Looking at paper,' 'Shake Head,' or 'Point' into your response by inserting them within square brackets at a suitable place. Ensure that each response includes at least one emotion. For example, you can write '[Shake Head] I don't believe you.' Or ‘This does not pertain to you [Point] as it is none of your business.’ Please keep your response limited to 2-6 sentences. As you haven't yet been prompted, only greet the student and ask them to begin.";
    let initJudgeConversation  = createConversation(blankConversation, 'system', systemPrompt);
    // Create a recorder
    const [recorder, setRecorder] = useState(new Recorder());
    const [conversation, setConversation] = useState(initJudgeConversation);


    // TO DO, if audio is playing, we should stop listening to the user so that the response is not heard as user input
    useEffect(() => {

        recorder.startRecording();
        // Wait for the recording to start and then continue while it records in the background
        // Note that its possible to try and get a response before the recording starts because there is no await

      }, []);


    const handleClick = () => {
        
        const func = async ()=>{
            const recordering = recorder.getRecording();
            const chatResponse = await Converse(conversation, recordering);
            // Add the user's transcript as their input to the chat bot
            let conv = createConversation(conversation, 'user', chatResponse.transcript);
            // Add the chat bot's response as to the history of the conversation
            conv = createConversation(conv, 'assistant', chatResponse.chatResponse);
            // Set the higher scoped conversation variable
            setConversation(conv);
            recorder.stopRecording();
            recorder.startRecording();
        }
        
        func();

    };

    return (
        <>
            <button onClick={handleClick}>{'Converse'}</button>
        </>
    );
}