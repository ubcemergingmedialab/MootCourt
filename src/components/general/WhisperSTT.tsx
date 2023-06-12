async function ServerRequestResponse(data: FormData, server){
    console.log('Trying to get Wattson response');
    const blankResponse = '';
    const errorResponse = '!Middle server request failed!';
    try {
        const response = await fetch(server, {
            method: 'POST',
            body: data
        });
        
        if (!response.ok) {
          throw new Error('Request failed');
        }
  
        return(response.json());
    }catch (err) {
        console.error(err);
        return(undefined);
    }
}

async function record(recodingName, duration){
    return new Promise((response, err)=>{
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            // This will add data to the chunks when that data is available
            mediaRecorder.addEventListener('dataavailable', (event) => {
                chunks.push(event.data);
            });
            
            // Start and slice up into blobs
            mediaRecorder.start(1000);
            console.log('recording started');

            // Stop recording after duration
            setTimeout(() => {
                mediaRecorder.stop();
                console.log('recording stopped');

                const recordedBlob = new Blob(chunks, { type: 'audio/webm' });

                const file = new File([recordedBlob], recodingName, {
                    type: 'audio/webm',
                    lastModified: new Date().getTime()
                });

                response(file); // Gives this value to the promise's response

            }, duration);
        })
        .catch((err) => {
            console.error('Error accessing microphone:', err);
            err(err);
        });
    });
}

// Convert a dictionary into one data packet 
function createFormData(options: any): FormData {
    const formData = new FormData();
  
    for (const key in options) {
        if (options.hasOwnProperty(key)) {
            formData.append(key, options[key]);
        }
    }
  
    return formData;
}

async function Whisper(options, duration): Promise<string>{
    let transcript = '';

    let recodingName = "userRecordingForTranscript.webm";
    return new Promise((transcriptOut, err)=>{
        record(recodingName, duration).then((response)=>{
        
            options.file = response;
            console.log(response);
    
            const data = createFormData(options);
            console.log(Array.from(data.entries()));
    
            ServerRequestResponse(data, 'http://localhost:80/api/stt')
            .then(response => {
                if(response!=undefined){
                    const transcript: string = response.text;
                    console.log('transcript: ', transcript);
                    transcriptOut(transcript);
                }
            })
            .catch(err => {
                console.error(err);
            });
    
        }).catch((err)=>{
            console.log(err);
        });
    });
}

function Analytics(totalDuration){

    const segments = 4;
    const interval = totalDuration/segments;
    // Prompt is a way of showing the style to format the transcript. Ex with or without punctuation
    const options = {prompt: "Hello ladies and gentile men of the court. I will now begin my argument."};
    const overlap = 5000; //Amount in ms to overlap recordings
    let transcriptData;

    const callWhisper = () =>{
        const then = new Date().getTime();
        Whisper(options, interval + overlap).then((transcript)=>{
            const now = new Date().getTime();
            const words = transcript.split(" ").length;
            let WPM = words/((now-then)/60000);
            WPM = Math.round(WPM*10)/10;
            transcriptData.append({transcript: transcript, WPM: WPM});
        })
    };

    callWhisper();
    const intervalId = setInterval(callWhisper, interval);

    setTimeout(() => {
    clearInterval(intervalId);
    }, totalDuration);

    console.log(transcriptData);
}

let isListening = false;
let button = 'Activate Whisper';
function InitiateListening(){

    const interval = 20000;
    const intervalId = setInterval(Analytics, interval);
    
    const handleClick = () => {
        isListening = !isListening;
        console.log('isListening: ', isListening);
        

        if(isListening){

            button = 'Activate Whisper';
            Analytics(interval);
        }
        else{
            clearInterval(intervalId);
            console.log('No longer trying to listen');
            button = 'Deactivate Whisper';
        }
    };

    
    return (
        <button onClick={handleClick}>{button}</button>
    );
}

export default InitiateListening