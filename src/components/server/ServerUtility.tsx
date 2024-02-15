enum AudioStreamType
{
    Chunks,
    Stream
}

export class ServerUtility
{
    static Blobs: Blob[] = [];
    static isAudioPlaying = false;
    static audioPlayer: HTMLAudioElement | null = null;

    static initializeWebSocket() : WebSocket
    {
        const socket = new WebSocket('ws://127.0.0.1:60001');
        socket.onopen = function(event)
        {
            //socket.send('authorization_request secret_password');
            console.log('WebSocket connection opened:', event);
        };

        socket.onclose = function(event)
        {
            if (event.wasClean)
            {
                console.log('WebSocket connection closed cleanly:', event);
            }
            else
            {
                console.error('WebSocket connection closed unexpectedly:', event);
            }

        };

        socket.onerror = function(error)
        {
            console.error('WebSocket error:', error);
        };

        return socket;
    }

    static sendMessageToServer(socket: WebSocket, message: string): void
    {
        if (message.length === 0)
        {
            console.log("Received empty user input, will not send message to server.");
            return;
        }
        if (socket.readyState === WebSocket.OPEN)
        {
            console.log("sending message: " + message);
            socket.send("[CSS]" + message);
        }else
        {
            console.error("Error sending message to web socket. Web socket state is " , socket.readyState);
        }
    }

    static playResponseAsAudio (data: string | Blob | string[], audioPlaybackType: AudioStreamType = AudioStreamType.Chunks)
    {
        console.log("PlayResponseAsAudio called");
        let blobCounter = 0;
        if (data instanceof Blob)
        {
            ServerUtility.Blobs.push(data);
            if (audioPlaybackType === AudioStreamType.Chunks && ServerUtility.isAudioPlaying === false)
            {
                ServerUtility.playBlobsSequentially(blobCounter++);
                return;
            }
        }

        if (typeof data === 'string' && data.includes("END") && audioPlaybackType === AudioStreamType.Stream)
        {
            ServerUtility.playBlobs();
        }
    }

    static pauseOrResumeAudioResponse()
    {
        const audio = ServerUtility.audioPlayer;
        if (!audio) {
            return;
        }

        if (audio.paused)
        {
            audio.play();
            return;
        }

        audio.pause();
    }

    static playBlobs()
    {
        ServerUtility.playBlobsSequentially(0);
    }

    static playBlobsSequentially(index: number)
    {
        console.log("Playing Blobs Sequentially");
        const data = ServerUtility.Blobs;
        if (index >= data.length)
        {
            return;
        }

        const audioData = data[index];
        const audioUrl = URL.createObjectURL(audioData);
        ServerUtility.audioPlayer = new Audio(audioUrl);

        ServerUtility.isAudioPlaying = true;

        ServerUtility.audioPlayer.addEventListener("ended", () => {
            data.splice(index, 1);
            URL.revokeObjectURL(audioUrl);
            ServerUtility.isAudioPlaying = false;
            ServerUtility.playBlobsSequentially(index);
        });

        ServerUtility.audioPlayer.play()
            .catch((error) => {
                console.error("Error playing audio: ", error);
            });
    }
}