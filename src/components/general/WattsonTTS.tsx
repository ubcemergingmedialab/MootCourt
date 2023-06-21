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

// It may be better to refactor in a more react like format
// This is currently assigned at the root so that cancel can be a sperately exported function and have access
// It might be better to have it accessible even higher in the app and passed down
let currentSource;
async function playArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
	try {

		let audioContext: AudioContext | null = null;

		// Check if you AudioContext is availble in the current browser
		if ('AudioContext' in window) {
			audioContext = new AudioContext();
		  } else if ('webkitAudioContext' in window) {
			// Explicitly cast window to any to bypass TypeScript's type checking
			audioContext = new (window as any).webkitAudioContext();
		  } else {
			// Browser doesn't support AudioContext
			console.error('Web Audio API not supported');
		  }

		  // Check if not null
		  if(audioContext){
			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
			const source = audioContext.createBufferSource();
			source.buffer = audioBuffer;
			source.connect(audioContext.destination);
	
			// Assign the new source to currentSource
			currentSource = source;
	
			// Start the audio playback
			source.start();
		  }

	} catch (error) {
		console.error('Error playing audio:', error);
	}
}

export function cancel(): void {
if (currentSource) {
	// Stop the audio playback
	currentSource.stop();
	console.log('Playback stopped');
	currentSource = null;
}
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

export async function speak(options: any){

	if(options.text === "Default speech text for judge." || options.text === "initial text state"){
		// Return if initial states
		return(null);
	}

	console.log('Speak Options: ', options);
	const formData = createFormData(options);

	// Generate audio file and get the file path from the server
	const response = await ServerRequestResponse(formData, 'http://localhost:60/api/tts');
	console.log('audio file generated');
	let responseJSON;
	if(response !== undefined){
		console.log('awaiting json');
		responseJSON = await response.json();
		console.log('json done');
	}
	
	console.log('getting audio: ', responseJSON.audioPath);
	const getData = createFormData({ 'audioPath': responseJSON.audioPath });

	// Get the file from the server at the file path 
	const audio = await	ServerRequestResponse(getData, 'http://localhost:60/api/audio');
	console.log('audio: ', audio);

	// Convert to arrayBuffer
	let arrayBuffer;
	if(audio !== undefined){
		arrayBuffer = await audio.arrayBuffer();
	}

	console.log('Should be playing audio');
	// Play the audio
	await playArrayBuffer(arrayBuffer);

	return(null);
}

// This is a dummy export because no DOM elements are generated
export default function TextToSpeech(){return(null);}