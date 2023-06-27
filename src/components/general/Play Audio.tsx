import React, { Suspense, useEffect, useState } from 'react'

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

export async function speak(options: any){
    // Get the audio file with a name based on the text that is to be said
    // The first 30 characters is currently used
	// Public is a special fold that can be accessed at runtime with env
    const filepath = `${process.env.PUBLIC_URL}/Audio/Judge Questions/judge-audio_${options.text.slice(0, 30)}.wav`;
    const audio = await import(filepath);
    playArrayBuffer(audio);
}

export default function dummy() {
	return(null);
}