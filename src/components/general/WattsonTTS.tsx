async function ServerRequestResponse(options: any, server){
console.log('Trying to get Wattson response');
const blankResponse = '';
const errorResponse = '!Middle server request failed!';
try {
	const response = await fetch(server, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(options),
	});
	

	if (!response.ok) {
		throw new Error('Request failed');
	}

	return(response.arrayBuffer());
	} catch (error) {
		console.error(error);
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

export function speak(options: any){

	console.log('Speak Options: ', options);

	ServerRequestResponse(options, 'http://localhost:7000/api/tts')
	.then(response => {
		const audioFile = response;
		if(audioFile!=undefined){
			console.log('Should be playing audio');

			playArrayBuffer(audioFile)
			.then((result)=>{

			})
			.catch((err)=>{

			});
		}
	})
	.catch(error => {
		console.error(error);
	});
	return(null);
}

export default function TextToSpeech(){return(null);}