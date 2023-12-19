class Recorder {
    public mediaRecorder: MediaRecorder | null = null;
    private chunks: Blob[] = [];
    private stream: MediaStream | null = null;
    private sampleDelay = 500;

    async startRecording() {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream, { audioBitsPerSecond: 128000, mimeType: 'audio/webm; codecs=opus' });
        this.mediaRecorder.addEventListener('dataavailable', (event) =>
        {
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
            this.mediaRecorder!.addEventListener('stop', () => {

                if (this.stream) {
                    const tracks = this.stream.getTracks();
                    tracks.forEach((track) => track.stop());
                }

                const recordedBlob = new Blob(this.chunks, { type: 'audio/webm' });
                resolve(recordedBlob);

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

    cleanup()
    {
        if (this.mediaRecorder)
        {
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
        }

    }
}

export default Recorder;