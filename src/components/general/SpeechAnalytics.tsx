/*import {useEffect, useState} from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export function SpeechAnalytics(chunksize: number, MeasureWPMLength: number) {
    
    // Defaults if inputs not provided or falsy
    chunksize = chunksize || 10;
    MeasureWPMLength = MeasureWPMLength || 10;
    
    
    useEffect(() => {
        console.log('Speech Analytics Started');
    }, []);


    // Intialization step
    const {transcript} = useSpeechRecognition();
    const BlankNumberArray: number[] = [];
    const BlankStringArray: string[] = [];

    // Use state may not be needed for some or all of these. Consider intializing with let if update function not used.
    const [SpeakingTimes] = useState([...BlankNumberArray]);
    const [SpeakingTimesContent] = useState([...BlankStringArray]);
    const [SpeakingTimesWPM] = useState([...BlankNumberArray]);

    const [TranscriptOld, setTranscriptOld] = useState(transcript);
    const [TranscriptDiff, setTranscriptDiff] = useState(transcript);
    const [triggerValue, incrementTriggerValue] = useState(0);

    function createBlankSpeechData(){
        return {
            prompt: "",
            time: [...BlankNumberArray],
            content:[...BlankStringArray] ,
            WPM: [...BlankNumberArray],
            measureWPM: [...BlankNumberArray]
        };
    };

    const [SpeechData, setSpeechData] = useState(createBlankSpeechData());
    
    let SpeakingTimesContentCollated: string[] = [];
    let SpeakingTimesWPMCollated: number[] = [];
    let SpeakingTimesZeroStartCollatedIndexMatch: number[] = [];
    let timeInterlacedPrompt = "";

    // Calculate the difference between neighbouring values (going backward)
    function ArrayDifference(array: number[]){
        return array.map((value, index, array) => {
            let diff = value - array[index - 1];
            
            // Sets value if NaN. The first index will check an index that does not exist with backward difference
            if(Number.isNaN(diff)){
                return 0;
            }

            return diff;
        });
    }

    // MeasureLength is the backward length to measure over
    // This is per update not per unit time which is somewhat unintuitive (y axis is WPM, x axis is # of updates not time)
    // Consider making this a length in time and check against the SpeakingTimes enter to find cutoff
    function MeasureWPM(SpeakingTimes: number[], SpeakingTimesContent: string[], measureLength: number){

        // Restrict to within available range
        measureLength = Math.min(measureLength, SpeakingTimes.length);

        // A length of at least 2 is required to get an ArrayDifference
        if(measureLength < 2){
            return 0;
        }

        // Take only last portion of time array
        let SubTimes = SpeakingTimes.slice(SpeakingTimes.length-measureLength);
        
        // Calculate the difference between neighbouring values
        SubTimes = ArrayDifference(SubTimes);
        // Remove the additional element that has edge case problems
        SubTimes.shift();
        // Add up shortened time array into float
        const SubTime = SubTimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        
        // Take only last portion of the content
        let SubContents = SpeakingTimesContent.slice(SpeakingTimes.length-measureLength);
        // Removed so that the arrays are 1-to-1
        SubContents.shift();
        // Concatenate array strings, no delimiter present
        const SubContent = SubContents.join("");
        
        // Count each word by spaces
        const WordCount = SubContent.split(" ").length;

        // Convert from ms to min and return WRDS/min
        return WordCount/((SubTime/1000)/60);
    }

    // With array = [1,2,3,4,5,6] and length = 2, expected output: [[1,2],[2,3],[5,6]]
    function CollateArray(array: any[], length: number){
        const collatedArray: any[] = [];

        // Push new array with chunks sliced from the original, "length" sized chunks
        for (let i = 0; i < array.length; i += length) {
            const chunk = array.slice(i, i + length);
            collatedArray.push(chunk);
        }

        return collatedArray;
    }

    // With array = ["1","2","3","4","5","6"] and length = 2, expected output: ["12","23","56"]
    // With array = [1,2,3,4,5,6] and length = 2, expected output: [3,7,11]
    function ReduceCollateArray(array: any[], length: number){
        
        // Combine neighbouring values into innerArrays
        const collatedArray = CollateArray(array, length);

        // Maps the innerArray to its reduced value;
        const reducedArray = collatedArray.map(innerArray => innerArray.reduce((accumulator, currentValue) => accumulator + currentValue));

        return reducedArray;
    }

    function padZero(value: number) {
        return value.toString().padStart(2, '0');
    }

    function formatTime(time: number){
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor((time % 60)*10)/10;
    
        const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        return formattedTime;
    }
    
    // Update the old transcript and the difference between the new and old
    useEffect(() => {
        
        setTranscriptDiff(transcript.slice(TranscriptOld.length, transcript.length));
        setTranscriptOld(transcript);

        incrementTriggerValue(triggerValue + 1);
    }, [transcript]);
    
    // Update time list when transcript is updated
    useEffect(() => {
        
        const currentTime = new Date().getTime();
        SpeakingTimes.push(currentTime);
        SpeakingTimesContent.push(TranscriptDiff);
        SpeakingTimesWPM.push(MeasureWPM(SpeakingTimes, SpeakingTimesContent, MeasureWPMLength));
        
        //console.log('Speaking times: ', ArrayDifference(SpeakingTimes));
        //console.log('Speaking times content: ', SpeakingTimesContent);
        //console.log('Speaking times WPM: ', SpeakingTimesWPM);

        // Chunk calculations may be optimized by disregarding previous chunks and concatenating then updating
        //Array Difference has an edge case where the first index is a special value. If set to zero the first sentance may have a lower WPM than it should
        const SpeakingTimesDiffCollated = ReduceCollateArray(ArrayDifference(SpeakingTimes), chunksize);
        SpeakingTimesContentCollated = ReduceCollateArray(SpeakingTimesContent, chunksize);
        // Note that this is a seperate calculation of WPM
        SpeakingTimesWPMCollated = SpeakingTimesDiffCollated.map((value, index) => {
            // Each word should have 1 space. Remove all spaces on the sides and add one to the end.
            const processedSentance = SpeakingTimesContentCollated[index].trim() + " ";
            const WordCount = processedSentance.split(" ").length;
            return WordCount/((value/1000)/60);
        });

        //console.log('Speaking times collated: ', SpeakingTimesDiffCollated);
        //console.log('Speaking times content collated: ', SpeakingTimesContentCollated);
        //console.log('Speaking times WPM collated: ', SpeakingTimesWPMCollated);


        // Generate a list of times that have indexes which match the collated and starts at zero
        const SpeakingTimesZeroStart = SpeakingTimes.map((value, index, array) => {
            return value - array[0];
        });

        for(let i = 0; i < SpeakingTimesZeroStart.length; i += chunksize){
            SpeakingTimesZeroStartCollatedIndexMatch.push(SpeakingTimesZeroStart[i]);
        }

        // Interlace time with the transcript
        // Note that index 0 is skipped so that there is a previous time
        
        for(let i = 1; i < SpeakingTimesContentCollated.length; i += 1){
            const time = SpeakingTimesZeroStartCollatedIndexMatch[i]/1000;
            const timePrevious = SpeakingTimesZeroStartCollatedIndexMatch[i-1]/1000;
            const WPM = Math.round(SpeakingTimesWPMCollated[i]);
            const sentance = SpeakingTimesContentCollated[i];
            const promptPortion = `WPM: ${WPM}, Time: [${formatTime(timePrevious)}] - [${formatTime(time)}], Transcript: ${sentance}`;
            
            timeInterlacedPrompt += `\n${promptPortion}`;
        }
        
        //console.log(timeInterlacedPrompt);

        setSpeechData({
            prompt: timeInterlacedPrompt,
            time: SpeakingTimesZeroStartCollatedIndexMatch,
            content: SpeakingTimesContentCollated,
            WPM: SpeakingTimesWPMCollated,
            measureWPM: SpeakingTimesWPM
        });
        
    }, [transcript]);


    return(SpeechData);
}

// This tsx does not export HTML but a valid export type is required
export default function SpeechAnalytics_Dummy(){
    return(null);
};*/

export {}