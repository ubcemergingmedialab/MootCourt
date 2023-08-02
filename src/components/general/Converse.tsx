import react, { ReactElement, ReactFragment } from 'react';
import {Readable} from 'stream';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import * as d3 from 'd3';
import { Svg } from '@react-three/drei';
import ReactDOM from 'react-dom/client';
import {Html} from "@react-three/drei";

const serverRoot = 'http://localhost:60';
/**
 * Makes post fetch request using FromData
 * @param data 
 * @param server 
 * @returns 
 */
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

/**
 * Creates a new message and appends it to the conversation
 * @param conversation List of OpenAI conversation messages
 * @param role One of 'user', 'assistant', 'system'
 * @param content The message to be appended
 * @returns List of OpenAI conversation messages
 */
function createConversation(conversation: Array<object>, role: string, content: string): Array<any> {
    let message = {role: role, content: content};
    let messages = [...conversation]
    messages.push(message);
    return messages;
}

/**
 * Converts a dictonary like object to FormData
 * @param options 
 * @returns 
 */
function createFormData(options: any): FormData {
	const formData = new FormData();

	for (const key in options) {
		if (options.hasOwnProperty(key)) {
			formData.append(key, options[key]);
		}
	}

	return formData;
}

/**
 * A controllable recorder
 */
class Recorder {
    public mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
    private stream: MediaStream | null = null;
    private sampleDelay = 500;

    async startRecording() {
            // Get microgpone access
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Get stream
            this.mediaRecorder = new MediaRecorder(this.stream, { audioBitsPerSecond: 128000, mimeType: 'audio/webm; codecs=opus' });
            // Append data as it becomes available
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.chunks.push(event.data);
            });

        this.mediaRecorder.start(this.sampleDelay);
        console.log('recording started');
    }

    getRecording(): Blob {
        return new Blob(this.chunks, { type: 'audio/webm' });
    }

    getSampleDelay(): number {
        return this.sampleDelay;
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

//TO DO: seems to have an issue playing the first audio in the queue

// Play the queue continuously
let audioContext = new (window.AudioContext)(); // may want to add webkit support, its also best if this is shared and on the app
let audioQueue: AudioBuffer[] = [];
let source;
/**
 * Seamlessly plays a dynamic audio queue to completion.
 * This needs to be reinitialized if the queue finishes and new audio is available
 * @returns 
 */
function playQueue(){

    // Check if there is a source
    // If there is, return to avoid starting multiple tracks
    if (source) {
        console.log('Already playing');
        return;
    }

    // Check if there are items in the queue
    if(audioQueue.length === 0){
        // Send out an event on the document that the queue has ended
        document.dispatchEvent(new Event('audioQueueEnd'));
        return;
    }

    // Get the next buffer
    let nextBuffer = audioQueue[0];

    // Create a new sound source
    source = audioContext.createBufferSource();
    source.buffer = nextBuffer;

    // Play the next item in the queue when this one has ended
    source.onended = () => {
        console.log('Starting next clip');

        // Remove the audio that has been played from the list
        audioQueue.shift();
        console.log(audioQueue.length);
        
        // Destroy this source so that a new one can start
        source = null;
        playQueue();
    };

    // Connect to the destination
    source.connect(audioContext.destination);

    // Start the source
    source.start(0);
}

/**
 * Gets audio from the server at an audio path then intiates continuous audio play
 * @param {string} audioPath The audio file path on the server
 */
async function GetPlayAudio(audioPath, clientId){

    const getData = createFormData(
        {
            audioPath: audioPath,
            clientId: clientId
        });

    // Get the audio file from the path that was given in the response
    console.log('Get audio: ', audioPath);

    const audioResponse = await ServerRequestResponse(getData, `${serverRoot}/api/audio`);

    if(audioResponse && audioResponse.ok){

        const arrayBuffer = await audioResponse.arrayBuffer();

        // Convert so that length can be read
        // A different type such as Float32Array may sound better but be slower
        const  int16View = new Int16Array(arrayBuffer);

        // Note that when decodeAudioData gets the array buffer it takes "ownership" of it
        // ArrayBuffer will be detatched and contain no audio data even if accessed earlier

        const audioData = await audioContext.decodeAudioData(arrayBuffer);
        
        audioQueue.push(audioData);
        
        playQueue();
    }
    
}

/**
 * Makes a request of the converse server.
 * Sends the current conversation, a recording, and some options.
 * Waits for the end of the response or audio playback before returning.
 * @param conversation 
 * @param recording 
 * @param lastResponseTime 
 * @returns 
 */
async function ConverseMultithread(conversation, recording, lastResponseTime): Promise<object>{

    const recordingFile = new File([recording], 'user-recording', {
        type: 'audio/webm',
        lastModified: new Date().getTime()
    });

    const voices = ['en-US_AllisonExpressive', 'en-US_AllisonV3Voice', 'en-US_EmilyV3Voice', 'en-US_EmmaExpressive', 'en-US_HenryV3Voice', 'en-US_KevinV3Voice', 'en-US_LisaExpresssive', 'en-US_LisaV3Voice', 'en-US_MichaelExpressive', 'en-US_MichaelV3Voice', 'en-US_OliviaV3Voice'];

    const data = {
        // Audio recording
        recording: recordingFile,
        // Prompt for whisper transcript style
        transcriptPrompt: 'Hello, I am here to present my case.',
        transcriptTemperature: 0.2,
        transcriptLanguage: 'en',
        messages: JSON.stringify(conversation),
        chatTemperature: 0.2,
        max_tokens: 200,
        
        // Judge voice setting
        voice: voices[3],
        // Judge speaking rate percentage shift. It can be negative
        // ex 0 is normal, 100 is x2 speed
        ratePercentage: 0,
        // Judge pitch percentage shift. It can be negative
        // ex 0 is normal, 100 is double pitch ie higher (check this)
        pitchPercentage: 10,
        // The last time that ChatGPT gave a response
        lastResponseTime: lastResponseTime
    };

    console.log('data: ', data);
    
    const formData = createFormData(data);

    // Send data to the server
    const response = await ServerRequestResponse(formData, `${serverRoot}/api/converse-multithread`);

    if(response === undefined){
        return conversation;
    }
    const responseJSON = await response.json();
    const clientId = responseJSON.clientId;
    console.log('My client Id: ', clientId);
    
    // Listen back for the server's response
    const eventSource = new EventSource(`${serverRoot}/api/converse-multithread?clientId=${clientId}`);

    eventSource.onerror = function(error) {
        console.error('EventSource failed:', error);
    };

    // Listen for incoming data
    eventSource.addEventListener('data', async (event) => {
        
        const responseJSON = JSON.parse(event.data);
        console.log('Received data: ');
        console.log(responseJSON);

        GetPlayAudio(responseJSON.audioPath, clientId);

    });

    // Return the completed response
    return new Promise(resolve => {
        eventSource.addEventListener('end', (event) => {

            const responseJSON = JSON.parse(event.data);
            console.log('Received final data: ');
            console.log(responseJSON);
            
            // Check if the expected data is in the response
            // Could have a more explicit differentiation that this is a no-response type of response
            if(responseJSON.audioPath !== undefined) {
                // This async function is not waited for so that audio can play in the background
                GetPlayAudio(responseJSON.audioPath, clientId);
                

            }else {

                console.log('AI chose not to respond or audioPath undefined');
            }

            // Close the connection
            eventSource.close();

            resolve(responseJSON);
        });
    });
}

/**
 * Depreciated method for making an API call to the server
 * @param conversation 
 * @param recording 
 * @returns 
 */
export async function Converse(conversation, recording){

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
        voice: 'en-US_MichaelV3Voice',// 'en-US_EmmaExpressive',
        // Judge speaking rate percentage shift. It can be negative
        // ex 0 is normal, 100 is x2 speed
        ratePercentage: 0,
        // Judge pitch percentage shift. It can be negative
        // ex 0 is normal, 100 is double pitch ie higher (check this)
        pitchPercentage: 0
    };
    
    const formData = createFormData(data);
    const response = await ServerRequestResponse(formData, `${serverRoot}/api/converse`);
    if(response !== undefined){
        const responseJSON = await response.json();
        const getData = createFormData({ 'audioPath': responseJSON.audioPath });
        // Get the audio file from the path that was given in the response
        const audio = await ServerRequestResponse(getData, `${serverRoot}/api/audio`);
        console.log(responseJSON);
        console.log(audio);
        if(audio !== undefined){
            const arrayBuffer = await audio.arrayBuffer();
            console.log(arrayBuffer);
            playArrayBuffer(arrayBuffer);
        }

        return responseJSON;
    }

    return null;
}


export default function ConverseAttach({ setIsSpeaking, appPaused }) {

    const toggleKey = 'Enter';
    // Sets whether or not the event is triggered to toggled
    const isManualTrigger = false;
    // When isManualTrigger = false, this is how often a response from chatGTP will be triggered
    const chatLoopInterval = 5 * 1000;
    
    const blankConversation: Array<object> = [];
    // SystemPrompt is the intial message that the conversation is prepoulated with to control ChatGPT's behavour
    // This should probably be part of the default settings in the JSON
    // It is possible to providing multiple system messages each with an intention is better than a large block
    // I believe that ChatGPT will read each and incorperate the instruction of each message somewhat seperately though considering the whole conversation
    // This might mean that distinct instructions should be seperated
    const systemPrompt = `
    Play the role of a Judge in Canada in a Judicial Interrogation System practiced in the Socratic method and the user is orally presenting at a Moot Court practice.
    Find their weakest point and ask questions about that single idea to challenge, provoke thought, and deepen the student's understanding of law.
    Consider the arguments of the appellant or respondent.
    `
    let initJudgeConversation  = createConversation(blankConversation, 'system', systemPrompt);
    
    // useRef does not re-render like useState does
    const conversation = useRef(initJudgeConversation);
    const runningResponse = useRef('');
    const runningTranscript = useRef('');
    const runningTimestamps = useRef<Array<any>>([]);
    const interval = useRef<NodeJS.Timeout>();
    const interactTime = useRef(new Date().getTime());
    const lastResponseTime = useRef(new Date().getTime());;
    
    // Create a recorder -> it might be better to use useRef
    const [recorder, setRecorder] = useState(new Recorder());

    
    // These are used to controll the conversation loop
    // Pressing enter once starts sets the intervalId and starts looping
    // Pressing it again switches the isListening to stops the loop
    const [keyDown, setKeyDown] = useState<string>();
    const [isListening, setIsListening] = useState(false);


    /**
     * This is a single loop which tracks the conversation state after making a new interaction
     * @returns 
     */
    const converseLoop = async ()=>{

        // Set interact time to current time 
        interactTime.current = Date.now();

        const recordering = recorder.getRecording();
        // Get the chat response to the recording
        // Playing audio is done inside Converse but the memory is handled outside here

        let chatResponse;

        if(false){
            chatResponse = await Converse(conversation.current, recordering);
        } else {
            // To DO
            // Tell the server when the last time you got a response was
            // On the server side use that to restrict how often chatGPT can respond
            // Also save a verson of the last user message sent. Don't ask for a response if its not different enough
            chatResponse = await ConverseMultithread(conversation.current, recordering, lastResponseTime.current);
        }

        // If there is an audio path then the chat bot did respond
        // Note that when ConverseMultithread is playing audio then it is awaited and thus this interact time is when the chat bot stops talking
        if(chatResponse.audioPath !== undefined) {
            // Set the last response time to the current time
            lastResponseTime.current = interactTime.current;
        }

        // *** Handle with timestamps ***

        // Shift time stamps by the delay between requests
        // Time stamps start from 0 so these need to have a relative shift
        // -> I think this needs to be fixed it consider the case where the response is not back yet but a new one is requested first
        // Ther deplay between might be smaller and it is not properlly offset
        let endOfLast = 0;
        if(runningTimestamps.current.length>0){
            endOfLast = runningTimestamps.current[runningTimestamps.current.length-1][2];
        }

        const timestamps = chatResponse.timestamps
        timestamps.map((timestamp)=>{
            // Convert to milliseconds for this API specifically
            timestamp[1] *= 1000;
            timestamp[2] *= 1000;
            // The referance point starts at 0 when the data comes in
            // The time the data was sent + 0 == the time the first word was said
            timestamp[1] += interactTime.current;
            timestamp[2] += interactTime.current;
        });

        // Join the timestamps together to maintain history
        runningTimestamps.current = runningTimestamps.current.concat(timestamps);
        console.log('stamp: ', runningTimestamps.current)

        // *** Handle with transcript ***

        console.log('conv: ', conversation.current);
        const transcript = chatResponse.transcript + ' ';
        console.log('transcript check: ', transcript);

        // If the latest transcript is a continuation of the last one ie no messages inbetween
        // Add this transcript onto the end of the last one
        if(conversation.current[conversation.current.length-1].role === 'user'){
            conversation.current[conversation.current.length-1].content += transcript;
            console.log('user check:  ', conversation.current[conversation.current.length-1].content);
            console.log('conv: ', conversation.current);
            
        } else {
            // Add the user's transcript as their input to the chat bot in the history
            conversation.current = createConversation(conversation.current, 'user', transcript);
            console.log('conv: ', conversation.current);

        }

        // Either the last message was user or a new user message was set
        // So by now the last message will be a user message

        // Store a history of just the transcript
        runningTranscript.current = runningTranscript.current + transcript;
        console.log('runningTranscript: ', runningTranscript);
        
        
        // *** Handle with chatResponse ***

        if(chatResponse.chatResponse !== undefined){
            // If this is true then the last message will be an assistant messsage
            // This marks the end of any transcript changes and a history can be saved

            // Add the chat bot's response to the history of the conversation
            conversation.current = createConversation(conversation.current, 'assistant', chatResponse.chatResponse);
            runningResponse.current = runningResponse.current + ' ' + chatResponse.chatResponse;
            console.log('conv: ', conversation.current);
        }

        // Clear data from the recording and start a new one
        recorder.stopRecording();

        // If some audio is waiting to be played then wait
        if (audioQueue.length > 0) {

            // Await the resolution of this promise
            await new Promise((resolve, reqject)=>{
                
                // Resolve this promise when there is no audio to be played
                document.addEventListener('audioQueueEnd', () => {
                    resolve(null);
                });
            });
        }

        // Resume listening to the user
        recorder.startRecording();

        return;
    }

    useEffect(() => {
        const keyDownHandler = (e) => {
            // Only allow user input while the app is unpaused
            if(!appPaused){
                setKeyDown(e.key);   
            }
        }
        document.addEventListener('keydown', keyDownHandler)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)

        }
    })

    // TO DO: this animation is not working at the moment because a function needs to be assed in to set the destination value
    // And rerender the module accordingly. As things are this loop is done properly but not accessible from outside of it

    // /**
    //  * Adds a character at a time to the destination until it matches the target 
    //  * @param target 
    //  * @param destination 
    //  * @param delay Delay between added values in milliseconds
    //  */
    //     const animateString = (destination: string, target: string, delay: number) =>{
    //         let i = destination.length;
    //         let intervalId;
    //         intervalId = setInterval(() => {
    //             if(target[i]){
    //                 // Add the current character to the display
    //                 destination += target[i];
    //                 // Only increase character count if one was added
    //                 i += 1;
    //             } else{
    //                 // i is out of range so you have animated all the data
    //                 clearInterval(intervalId);
    //             }
    //         }, delay);
    //     }

    // useEffect(()=>{

        
    //     // Not sure how this will be affected if it isn't finished by the time one of these changes and this is triggered
    //     animateString(displayResponse.current, runningResponse.current, 500);
    //     animateString(displayTranscript.current, displayTranscript.current, 500);

    // }, [runningResponse.current, runningTranscript.current]);
        
    useEffect(()=>{

        if(keyDown === toggleKey){
        
            if(isManualTrigger){

                // One time trigger of loop
                // This name may be misleading
                // It is a single loop process that can be looped infinitely but does not do so by default
                converseLoop();


            } else{
                
                const volumes: Array<number> = [];
                // Check the toggle state
                // If it is not listening then listen
                if(!isListening) {

                    recorder.startRecording();

                    // Function to calculate the volume
                    const calculateVolume = async () => {
                        const blob = recorder.getRecording();
                        const audioBuffer = await blob.arrayBuffer();
                        try {
                            // May or may not want to create a new audioContext
                            const audioContext = new (window.AudioContext); //|| window.webkitAudioContext)();
                            const audioSource = audioContext.createBufferSource();
                            const decodedBuffer = await audioContext.decodeAudioData(audioBuffer);
                            audioSource.buffer = decodedBuffer;
                        
                            // Create a gain node with zero gain ie muted
                            const gainNode = audioContext.createGain();
                            gainNode.gain.value = 0;
                        
                            // Connect the audio source to the gain node and gain node to the audio destination
                            audioSource.connect(gainNode);
                            gainNode.connect(audioContext.destination);
                        
                            // Start the audio source
                            // Would normally play audio but it is muted
                            audioSource.start();
                        
                            // Wait for a short duration to allow audio processing
                            await new Promise((resolve) => setTimeout(resolve, recorder.getSampleDelay()));
                        
                            // Get the channel data as mono audio
                            let channelData = decodedBuffer.getChannelData(0);
                            //let channelData = new Float32Array(audioBuffer); 

                            // Get the more recent portion of audio
                            // Convert bits to bytes per second and multiply by seconds
                            const readWindow = 2 * ((recorder.mediaRecorder?.audioBitsPerSecond || 0) / 8);
                            const maxLength = Math.min(readWindow, channelData.length);
                            const startIndex = channelData.length - maxLength;
                            channelData = channelData.subarray(startIndex, channelData.length);

                            // Calculate the root mean square volume
                            const sumOfSquares = channelData.reduce((accumulator, sample) => accumulator + sample * sample, 0);
                            const meanOfSquares = sumOfSquares / channelData.length;
                            const rmsVolume = Math.sqrt(meanOfSquares);
                        
                            // Calculate volume in decibels (dB)
                            const db = 20 * Math.log10(rmsVolume);

                            if(Math.abs(db) === -Infinity){
                                return null;
                            }
                        
                            // Return the calculated volume in dB
                            return db;

                        } catch (error) {
                            // TO DO find the source of the this Error:
                            // DOMException: Failed to execute 'decodeAudioData' on 'BaseAudioContext': Unable to decode audio data
                            // For now this can go unhandled and return null

                            //console.error('Error calculating volume:', error);
                            return null;
                        }
                    };
                    
                    // Repeat every x seconds
                    let requests = 0;
                    interval.current = setInterval( async () => {
                        const volume = await calculateVolume();
                        volumes.push(volume || 0);
                        // The duration over which to take the average for slience
                        // A larger value will both increase the lag and length of slience required
                        const lookBackTime = 2 * 1000;
                        // ex after every 10 seconds you push the array then if you want to look back 20 seconds then 20/10 = 2 indexes
                        const volumeLookBack = Math.floor(lookBackTime/recorder.getSampleDelay());
                        const volumePortion = volumes.slice(volumes.length-volumeLookBack);
                        const volumePortionAverage = volumePortion.reduce((accumulator, v) => accumulator + v, 0)/volumePortion.length;

                        // Average of first 5 sample will be the zero point reference
                        // This should only be done once and stored
                        // Not all of the volume needs to be stored and can but cuttoff
                        const reffStart = 5;
                        const reffEnd = 20;
                        const volumeZeroReff = volumes.slice(reffStart, Math.min(volumes.length, reffEnd)).reduce((accumulator, v) => accumulator + v, 0)/(reffEnd-reffStart);
                        const normalizedVolume =  volumePortionAverage - volumeZeroReff;



                        // A volume less than this will trigger a potential response
                        const minVolume = -40;

                        const timeSinceLastInteraction = Date.now() - interactTime.current;
                        // After this time a request will be made
                        const maxTime = 60 * 1000;
                        // Only after this time a request can be made
                        const minTime = 5 * 1000;

                        console.log('volAverage: ', normalizedVolume);
                        console.log('reqs', requests);
                        console.log('quiet: ', normalizedVolume < minVolume);
                        console.log('min: ', timeSinceLastInteraction > minTime);
                        console.log('max: ', timeSinceLastInteraction > maxTime);
                        
                        // Make a request if (the volume is low and some minimum time has passed)
                        // Or it has been too long since the last request
                        // And only make a request if there are no other unresolved requests
                        if((((normalizedVolume < minVolume) && (timeSinceLastInteraction > minTime)) || timeSinceLastInteraction > maxTime) && requests === 0) {
                            requests ++;
                            try {
                                // It seems that this await is not being respected for the interval
                                // Using a counter is a fix for that
                                await converseLoop();
                            }
                            catch (err){
                                console.error(err);
                            }
                            // Request finished
                            requests --;
                        }
                    // The frequency with which to check is determined by this
                    // It does not make much sense to check more often than there is a change
                    }, recorder.getSampleDelay());
    
                }else {

                    recorder.stopRecording();

                    clearInterval(interval.current);
                }

                // Toggle the state
                setIsListening(!isListening);
            }



            // Clear the current key
            setKeyDown(undefined);
        }

    }, [keyDown]);

    // Simulate hitting the toggle key when the app is paused if it was on
    const [wasListeningBeforePause, setwWsListeningBeforePause] = useState<Boolean>();
    useEffect(()=>{

        // If it is now paused and it is listening then stop listening
        // Otherwise do nothing as it is already not listening
        if(appPaused && isListening){
            setwWsListeningBeforePause(true);
            setKeyDown(toggleKey);
        } else {
            setwWsListeningBeforePause(false);
        }

        // When unpaused, turn listening back on if it was on before the pause
        if(!appPaused && wasListeningBeforePause){
            setKeyDown(toggleKey);
        }

    }, [appPaused]);


    useEffect(()=>{
        const sendDataEvent = new CustomEvent('timestampsUpdated', {detail: {
            runningTimestamps: runningTimestamps.current,
            conversation: conversation.current
        }});
        document.dispatchEvent(sendDataEvent);
        console.log('event sent');
    }, [runningTranscript.current]);

    // Openly sourced from https://iconoir.com/
    const micNormal = <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><rect x="9" y="2" width="6" height="12" rx="3" stroke="#000000" stroke-width="1.5"></rect><path d="M5 10v1a7 7 0 007 7v0a7 7 0 007-7v-1M12 18v4m0 0H9m3 0h3" stroke="#000000" stroke-width="1.5" strokeLinecap="round" stroke-linejoin="round"></path></svg>
    const micMute = <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 3l18 18M9 9v0a5 5 0 005 5v0m1-3.5V5a3 3 0 00-3-3v0a3 3 0 00-3 3v.5" stroke="#000000" stroke-width="1.5" strokeLinecap="round" stroke-linejoin="round"></path><path d="M5 10v1a7 7 0 007 7v0a7 7 0 007-7v-1M12 18v4m0 0H9m3 0h3" stroke="#000000" stroke-width="1.5" strokeLinecap="round" stroke-linejoin="round"></path></svg>
    const micWarn = <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M21 14v4M21 22.01l.01-.011" stroke="#000000" stroke-width="1.5" strokeLinecap="round" stroke-linejoin="round"></path><rect x="7" y="2" width="6" height="12" rx="3" stroke="#000000" stroke-width="1.5"></rect><path d="M3 10v1a7 7 0 007 7v0a7 7 0 007-7v-1M10 18v4m0 0H7m3 0h3" stroke="#000000" stroke-width="1.5" strokeLinecap="round" stroke-linejoin="round"></path></svg>
    
    const [micIcon, setMicIcon] = useState<JSX.Element>();
    useEffect(()=>{
        if(recorder.mediaRecorder){
            const recorderState = recorder.mediaRecorder.state;
            console.log('recorderState: ', recorderState) 
            if((recorderState === 'inactive') || (!isListening)){
                setMicIcon(micMute);
            } else if((recorderState === 'recording') || (isListening)){
                setMicIcon(micNormal);
            }
        } else {
            // May need to use a more clear micWarn
            setMicIcon(micMute);
        }

    }, [isListening, recorder.mediaRecorder?.state]);

    // Change the speaking state
    useEffect(()=>{
        // If the audioQueue is larget than zero it should be playing
        if(audioQueue.length > 0){
            setIsSpeaking(true);
        }else {
            setIsSpeaking(false);
        }

    }, [audioQueue.length]);

    //return null
    return (
        <Html fullscreen>
            <div className='micIndicatorContainer' style={{
                backgroundColor: 'white',
                width: 'min-content',
                height: 'min-content',
                border: '2px solid black',
                borderRadius: '50px',
                position: 'absolute',
                marginLeft: '50vw',
                marginRight: '50vw',
                marginBottom: '50px',
                scale: '2',
                bottom: 0,
                }}>

                <div style={{
                    width: 'min-content',
                    height: 'min-content',
                    transform: 'translateY(2px)',
                    position: 'relative',
                    margin: 'auto',
                    }}>

                    {micIcon}
                </div>
            </div> 
        </Html>
    );
}