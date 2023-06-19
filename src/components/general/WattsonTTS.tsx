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

let currentSource; // It may be better to refactor in a more react like format
async function playArrayBuffer(arrayBuffer: ArrayBuffer): Promise<void> {
	try {
		const audioContext = new AudioContext();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);

		// Assign the new source to currentSource
		currentSource = source;

		// Start the audio playback
		source.start();

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