import react from 'react';
import {Readable} from 'stream';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

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

// Continue the previous conversation with a new message
function createConversation(conversation: Array<object>, role: string, content: string): Array<any> {
    let message = {role: role, content: content};
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


// Play the queue continuously
let audioContext = new (window.AudioContext)(); // may want to add webkit support
let audioQueue: AudioBuffer[] = [];
let source;
function playQueue(){

    // Check if there is a source
    // If there is, return to avoid starting multiple tracks
    if (source) {
        console.log('Already playing');
        return;
    }

    // Check if there are items in the queue
    if(audioQueue.length === 0){
        return;
    }

    // Get the next buffer
    let nextBuffer = audioQueue.shift();

    // Create a new sound source
    source = audioContext.createBufferSource();
    source.buffer = nextBuffer;

    // Play the next item in the queue when this one has ended
    source.onended = () => {
        console.log('Starting next clip');
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

async function GetPlayAudio(audioPath){

    const getData = createFormData({ 'audioPath': audioPath });
    // Get the audio file from the path that was given in the response

    console.log('Get audio: ', audioPath);

    const audioResponse = await ServerRequestResponse(getData, 'http://localhost:60/api/audio');

    if(audioResponse && audioResponse.ok){

        const arrayBuffer = await audioResponse.arrayBuffer();

        // Convert so that length can be read
        const  int16View = new Int16Array(arrayBuffer);

        // Note that when decodeAudioData gets the array buffer it takes "ownership" of it
        // ArrayBuffer will be detatched and contain no audio data even if accessed earlier in this callback

        const audioData = await audioContext.decodeAudioData(arrayBuffer);
        
        audioQueue.push(audioData);
        
        playQueue();
    }
    
}

export async function ConverseMultithread(conversation, recording): Promise<object>{

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
            voice: 'en-US_MichaelV3Voice',// 'en-US_EmmaExpressive',
            // Judge speaking rate percentage shift. It can be negative
            // ex 0 is normal, 100 is x2 speed
            ratePercentage: 0,
            // Judge pitch percentage shift. It can be negative
            // ex 0 is normal, 100 is double pitch ie higher (check this)
            pitchPercentage: 0
        };
        
        const formData = createFormData(data);

        // Send data to the server
        const response = await ServerRequestResponse(formData, 'http://localhost:60/api/converse-multithread');

        if(response === undefined){
            return conversation;
        }
        const responseJSON = await response.json();
        const clientId = responseJSON.clientId;
        console.log('My client Id: ', clientId);
        
        // Listen back for the server's response
        const eventSource = new EventSource(`http://localhost:60/api/converse-multithread?clientId=${clientId}`);

        eventSource.onerror = function(error) {
            console.error('EventSource failed:', error);
        };



        // Listen for incoming data
        eventSource.addEventListener('data', async (event) => {
            
            const responseJSON = JSON.parse(event.data);
            console.log('Received data: ');
            console.log(responseJSON);

            GetPlayAudio(responseJSON.audioPath);

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
                    GetPlayAudio(responseJSON.audioPath);
                    

                }else {

                    console.log('AI chose not to respond or audioPath undefined');
                }

                // Close the connection
                eventSource.close();

                resolve(responseJSON);
            });
        });
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
            voice: 'en-US_MichaelV3Voice',// 'en-US_EmmaExpressive',
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

/**
 * @param timestamps An array of array [word: string, start: number, end: number]
 * @param interval The frame in seconds over which to accumulate data
*/
function STTAnalysis(timestamps, interval){

    let frame = interval;
    const duration = timestamps[2];
    const WPM:Array<number> = [];

    let wordCount = 0;
    timestamps.map((timestamp:any)=>{
        // There is a word for every index
        wordCount += 1;
        const start = timestamp[1];
        const end = timestamp[2];

        // This check does not seem to be working as intenteded
        // It seems like more values are passing than they should
        // Meaning that even if you wait awhile it will acount those words and have a higher word count
        // Not lower as expected
        if(end >= frame){
            frame += interval;
            // if interval is 60s then the WPM == wordCount but if 30s then WPM == WordCount * 2
            WPM.push(wordCount/(60/interval));
        }
    });

    return WPM;
}

export default function ConverseAttach(config) {

    // Sets whether or not the event is triggered to toggled
    const isManualTrigger = true;
    // When isManualTrigger = false, this is how often a response from chatGTP will be triggered
    const chatLoopInterval = 5 * 1000;
    
    const blankConversation: Array<object> = [];
    // SystemPrompt is the intial message that the conversation is prepoulated with to control ChatGPT's behavour
    // This should probably be part of the default settings in the JSON
    // It is possible to providing multiple system messages each with an intention is better than a large block
    // I believe that ChatGPT will read each and incorperate the instruction of each message somewhat seperately though considering the whole conversation
    // This might mean that distinct instructions should be seperated
    const systemPrompt = "Play the role of a Judge in Canada in a Judicial Interrogation System practiced in the Socratic method and the user is orally presenting at a Moot Court practice. Find their weakest point and ask questions about that single idea to challenge, provoke thought, and deepen the student's understanding of law. Consider the arguments of the appellant or respondent. The transcript provided to you will contain information regarding their WPM and the [start-stop] time of speaking. Incorporate the emotions 'Nod,' 'Looking at paper,' 'Shake Head,' or 'Point' into your response by inserting them within square brackets at a suitable place. Ensure that each response includes at least one emotion. For example, you can write '[Shake Head] I don't believe you.' Or ‘This does not pertain to you [Point] as it is none of your business.’ Please keep your response limited to 2-6 sentences. As you haven't yet been prompted, only greet the student and ask them to begin.";
    let initJudgeConversation  = createConversation(blankConversation, 'system', systemPrompt);
    
    // useRef does not re-render like useState does
    const conversation = useRef(initJudgeConversation);
    const runningResponse = useRef('');
    const runningTranscript = useRef('');
    const runningTimestamps = useRef([]);
    const interval = useRef<NodeJS.Timeout>();
    const interactTime = useRef(new Date().getTime());
    
    // Create a recorder -> it might be better to use useRef
    const [recorder, setRecorder] = useState(new Recorder());

    
    // These are used to controll the conversation loop
    // Pressing enter once starts sets the intervalId and starts looping
    // Pressing it again turns stateToggle to false and stops the loop
    const [keyDown, setKeyDown] = useState();
    const [stateToggle, setStateToggle] = useState(true);


    // TODO: There seems to be issues with the state of some react varaiable being forgotten
    // Perhaps the page is being reloaded by the timmer

    const converseLoop = async ()=>{
        const recordering = recorder.getRecording();
        // Get the chat response to the recording
        // Playing audio is done inside Converse but the memory is handled outside here

        let chatResponse;

        if(false){
            chatResponse = await Converse(conversation.current, recordering);
        } else {
            chatResponse = await ConverseMultithread(conversation.current, recordering);
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

        const now = new Date().getTime();
        const timestamps = chatResponse.timestamps
        timestamps.map((timestamp)=>{
            timestamp[1] += endOfLast + (now-interactTime.current)/1000;
            timestamp[2] += endOfLast + (now-interactTime.current)/1000;
        });

        // Set interact time to current time 
        interactTime.current = now;

        // Join the timestamps together to maintain history
        runningTimestamps.current = runningTimestamps.current.concat(timestamps);

        console.log('Stamps: ', runningTimestamps.current);
        console.log('Analysis: ', STTAnalysis(runningTimestamps.current, 10));

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
        // So by now the last message with be a user message

        //Store a history of just the transcript
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
        // Ideally we should wait until after the judge is done responding to start recording
        recorder.stopRecording();
        recorder.startRecording();

        return;
    }


    // TO DO, if audio is playing, we should stop listening to the user so that the response is not heard as user input
    useEffect(() => {

        recorder.startRecording();
        // Wait for the recording to start and then continue while it records in the background
        // Note that its possible to try and get a response before the recording starts because there is no await

    }, []);


    useEffect(() => {
        const keyDownHandler = (e) => {
            setKeyDown(e.key);
        }
        document.addEventListener('keydown', keyDownHandler)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)

        }
    })
        
    useEffect(()=>{

        if(keyDown == 'Enter'){
            
        
            if(isManualTrigger){

                // One time trigger of loop
                // This name may be misleading
                // It is a single loop process that can be looped infinitely but does not do so by default
                converseLoop();


            } else{
                
                // Check the toggle state
                if(stateToggle){

                    // Repeat every x seconds
                    interval.current = setInterval(() => {
                        converseLoop();
                    }, chatLoopInterval);
    
                }else {
                    clearInterval(interval.current);
                }

                // Toggle the state
                setStateToggle(!stateToggle);
            }



            // Clear the current key
            setKeyDown(undefined);
        }

    }, [keyDown]);


    // // For caption purposes. It would be good to have live looking response
    // // You can look for the change in the message and get the difference in the length
    // // Use a slice and animate that over time to make it look like
    // // Extra measures will be needed to handle when new data comes in and it is not done
    // // Consider using a queue like method

    // // not very react like
    // let previous;
    // useEffect(()=>{
    //     const current = runningResponse.length;
    //     const diff = current - previous;
    //     previous = current;

    //     diff
    //     slice

    // }, [runningResponse]);

    return (
        <>
            <div className="captions-container">
                <p> {runningResponse.current.slice(runningResponse.current.length-500)} </p>
            </div>
            <div className="captions-container">
                <p> {runningTranscript.current.slice(runningTranscript.current.length-500)} </p>
            </div>
        </>
    );
}