import './AssessmentPage.css';
import React, {ReactElement, useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import ReactDOM, {createRoot} from 'react-dom/client';
import LinePlot from './linePlot';
import {ColorManagement} from "three/src/math/ColorManagement";
import convert = ColorManagement.convert;

enum STTAnalysisType
{
    Discrete,
    Continuous
}

async function STTAnalysis(yAxisData, windowWidth, analysisType = STTAnalysisType.Discrete){

    const zeroOffset = Math.min(...yAxisData);
    const dataMax = Math.max(...yAxisData);
    const duration = dataMax - zeroOffset;
    const numXRanges = Math.ceil(duration / windowWidth);
    const xAxisData  = new Array(numXRanges).fill(0);

    const windowedData = xAxisData.map((x, index)=>
    {
        let lowerBound, upperBound;
        if (analysisType === STTAnalysisType.Discrete)
        {
            x = zeroOffset + (dataMax < windowWidth ? dataMax : index * windowWidth);
            lowerBound = x;
            upperBound = lowerBound + windowWidth;
        }
        else {
            x = zeroOffset + index * windowWidth;
            lowerBound = x - windowWidth / 2;
            upperBound = x + windowWidth / 2;
        }

        xAxisData[index] = x;

        let count = 0;
        yAxisData.map((y)=>{

            if(y >= lowerBound && y < upperBound){
                count += 1;
            }
        });

        const windowWidthInMinutes = convertToMinutes(windowWidth);
        return count / windowWidthInMinutes;
    })

    return (
        {
            xAxis: xAxisData,
            windowedData: windowedData
        }
    );
}

//----------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------
interface GraphPlotProps
{
    data: Array<[number,number]> | Array<[string, number]>;
    rangeToHighlight: [number, number] | undefined;
    dispatcher: d3.Dispatch<object>;
    windowWidth: number;
}

const GraphPlot = ({data, rangeToHighlight, dispatcher, windowWidth} : GraphPlotProps) => {
    const [chart, setChart] = useState<LinePlot | null>(null);

    useEffect(() => {
        if (!data || data.length === 0)
        {
            console.error("No data to display");
            return () => null;
        }

        if (!chart)
        {
            const chart: LinePlot = new LinePlot({parentElement: '#vis-lineplot'}, data, dispatcher, windowWidth);
            setChart(chart);
            chart.updateVis();

        } else if (chart)
        {
            chart.updateVis();
        }
        return () => {};
    }, [data, chart]);

    useEffect(() =>
    {
        if(chart)
        {
            chart.data = data;
            chart.updateVis();
        }
    }, [data]);

    useEffect(() => {
        if (rangeToHighlight && chart) {
            chart.highlightedRange = rangeToHighlight;
            chart.updateVis();
        }
    }, [rangeToHighlight, chart]);

    useEffect(() => {
        if (windowWidth && chart) {
            chart.interval = windowWidth;
            chart.updateVis();
        }
    }, [windowWidth, chart]);

    return (
        <div className="linePlot">
            <div id="vis-lineplot"></div>
            <div id="lineplot-tooltip"></div>
        </div>
    );
}

//----------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------

export default function AssessmentPage({config, updateConfig, updateAppState, judgeElapsedTime})
{
    const windowMax = 120000;
    const windowMin = 1000;
    const [windowWidth, setWindowWidth] = useState<number>(60000);
    const smoothingSlider = useRef<HTMLInputElement>(null);

    const onSmoothingSliderChange = () =>
    {
        if (smoothingSlider.current === null)
        {
            console.error("Did you instantiate smoothingSlider correctly?")
            return;
        }
        setWindowWidth(parseFloat(smoothingSlider.current.value));
    }

    const runningTimestamps = useRef<Array<any>>([]);
    const runningTranscript = useRef('');
    const conversation = useRef([]);

    const displayConversation = useRef<[ReactElement]>([<></>]);
    const hoverableTranscriptElems = useRef<Array<[string, number]>>([]);

    const plotResizeObserver = useRef<ResizeObserver>();
    const plotRoot = useRef<ReactDOM.Root>();

    const [points, setPoints] = useState<Array<[number,number]>>([]);
    const [hoveredWords, setHoveredWords] = useState<[string, number]>();
    const [highlightedRange, setHighlightedRange] = useState<[number, number]>();
    const dispatcher = d3.dispatch('highlightedRange');
    const Plot = <GraphPlot data={points} rangeToHighlight={highlightedRange} dispatcher={dispatcher} windowWidth={windowWidth}/>;

    runningTimestamps.current = config.runningTimestamps;
    conversation.current = config.conversation;

    const processData = (async () => {
        //----------------------------------------------------------------------------------------------------------------------
        // Only use for Testing!
        //const testData = generateTestData(2, 0.5);
        //runningTimestamps.current = testData;
        //
        //----------------------------------------------------------------------------------------------------------------------

        if (!runningTimestamps.current) {
            console.error("Please ensure config.runningTimestamps is instantiated.")
            return;
        }

        if (config.runningTimestamps.length <= 0) {
            console.error("No data found in config.runningTimestamps.current. Did you populate it?")
            return;
        }

        const yAxisData = runningTimestamps.current.map((timestamp) => {
            return (timestamp[1]);
        });

        const speakingData = await STTAnalysis(yAxisData, windowWidth);
        const xMin = Math.min(...speakingData.xAxis);
        const dataPoints = speakingData.xAxis.map((x, index): [number, number] => {
            const normalizedXTimeInMinutes = convertToMinutes(x - xMin);
            return [normalizedXTimeInMinutes, speakingData.windowedData[index]];
        });
        setPoints([...dataPoints]);
    });

    useEffect(()=>{
        processData();

        // Unmount the old observer for the plot
        /*const currentObserver = plotResizeObserver.current;
        if(currentObserver){
            currentObserver.disconnect();
        }*/

        //const plot = new LinePlot(svgContainer, points, true);
        // Store the newly mounted observer
        //plotResizeObserver.current = plot.observer;

        if (!runningTimestamps.current)
        {
            setErrorTextVisibility('display');
            return;
        }

        setErrorTextVisibility('none');
        runningTimestamps.current.map((timestamp) => {
            const word = timestamp[0] + ' ';
            const startTime = timestamp[1];
            const hoverable: [string, number] = [word, startTime];
            hoverableTranscriptElems.current.push(hoverable);
        });

        fillTranscriptWithWords(plotRoot, hoverableTranscriptElems, onWordHovered);

    }, [runningTranscript.current]);

    const onWordHovered = (transcriptElem: [string, number]) =>
    {
        setHoveredWords([...transcriptElem]);
    };

    useEffect(() =>
    {
        processData();
    }, [windowWidth]);

    useEffect(() =>
    {
        updateTranscriptHighlightedWords(hoveredWords, windowWidth, setHighlightedRange);
    }, [hoveredWords]);

    dispatcher.on('highlightedRange', highlightedRange =>
    {
        updateTranscriptHighlightedWords(hoveredWords, windowWidth, setHighlightedRange, highlightedRange);
    });

    const startApp = () => {
        const confirmRestart = window.confirm("You are about to end your session. This action will take you back to the start and you will no longer be able to see your assessment form. Are you sure you want to proceed?");
        if(confirmRestart){
            updateAppState(0);
        }
    }
    return (<>
        <div className="analysis-container">
            <div className="sideMenuBackground" id="assessment-page">
                <div className="sideMenuInner">
                    <div className="sideMenuTitleText">
                        <h1>ASSESSMENT</h1>
                        <div className="hr-1"></div>
                    </div>

                    <div id="summary" className="drop-down">
                        <p>SUMMARY</p>
                        <div className='graph-controls'>
                            Interval
                            <input id="window-slider"
                               type="range"
                               min={windowMin}
                               max={windowMax}
                               value={windowWidth}
                               defaultValue={windowWidth}
                               onChange={onSmoothingSliderChange}
                               ref={smoothingSlider}
                               step="1000"/>
                            <span>Value: {windowWidth} ms ({convertToMinutes(windowWidth).toFixed(2)} minutes)</span>
                        </div>
                        <div className="assessment-page-inner-box">
                            <div className="transcript-container"></div>
                            {points.length > 0 && Plot}
                        </div>
                        <div id="error-text">
                            <p>No data was found. No audio was detected/recorded.</p>
                        </div>
                    </div>

                    <div className="sideMenuContents">
                        <div className="buttonFlexBox">
                            <button className="button" type="button" id="Start" onClick={startApp}> BACK TO START </button>
                        </div>
                    </div>

                    {/* <div id="transcript" className="drop-down">
                        <p>TRANSCRIPT</p>
                        <div className="inner-box">
                            <div className="full-transcript-container">{displayConversation.current}</div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    </>);
}

export function displayConversationValue({config}) {

    // Using the object to preserve the structure of the method without using react
    const displayConversation = {current: [<></>]};
    const conversation = {current: []};

    // Clear the elements
    displayConversation.current = [<></>];
    let lastRole = '';

    conversation.current = config.conversation || [];
    conversation.current.map((message: any)=>{
        // Do not add system messages
        if(message.role !== 'system'){

            // const currentTime = new Date();
            // let hours = currentTime.getHours();
            // const minutes = currentTime.getMinutes();
            // const seconds = currentTime.getSeconds();

            // let period = 'AM';
            // if(hours > 12){
            //     period = 'PM';
            // }
            // hours =  hours === 12 ? 12 : hours - 12;

            // let formattedHours = hours.toString();
            // const formattedMinutes = minutes.toString().padStart(2, '0');
            // //const formattedSeconds = seconds.toString().padStart(2, '0');

            // const timeString = `${formattedHours}:${formattedMinutes}${period}`;

            const name = `${message.role}-message`;
            const tag = `${message.role.toUpperCase()}: `;
            const block = <p className={name}>{tag}{message.content}</p>;
            displayConversation.current.push(block);
        }

        // Break line if it is from a different user
        if(message.role !== lastRole ){
            displayConversation.current.push(<><br></br></>);
        }

        lastRole = message.role;
    });

    return(<>
        <div className="inner-box">
            <div className="full-transcript-container">{displayConversation?.current}</div>
        </div>
    </>);
}

//----------------------------------------------------------------------------------------------------------------------
// Helper Functions
//----------------------------------------------------------------------------------------------------------------------
function fillTranscriptWithWords(plotRoot, hoverableTranscriptElems, onWordHovered)
{
    const transcriptContainer = document.getElementsByClassName("transcript-container")[0];

    if(plotRoot.current !== undefined){
        plotRoot.current.unmount();
    }

    plotRoot.current = createRoot(transcriptContainer);

    hoverableTranscriptElems.current.map(([word, startTime], index) => {
        const spanElement = document.createElement('span');

        spanElement.setAttribute('key', index);
        spanElement.setAttribute('data-startTime', startTime);
        spanElement.style.color = 'black';
        spanElement.textContent = word;
        spanElement.addEventListener('mouseenter', () => onWordHovered([word, startTime]));

        transcriptContainer.appendChild(spanElement);
    });
}

function updateTranscriptHighlightedWords(hoveredWord, windowWidth, setHighlightedRange, highlightedRange = null) {
    let startRange, endRange;
    const transcriptContainer = document.getElementsByClassName("transcript-container")[0];
    const spanElements = transcriptContainer.getElementsByTagName('span');

    const resetHighlights = (() => {
        for (let i = 0; i < spanElements.length; i++)
        {
            const elem = spanElements[i];
            elem.style.color = 'black';
        }
    });

    if (!hoveredWord && !highlightedRange)
    {
        resetHighlights();
        return;
    }

    const initializeRanges = ((hoveredWord) =>
    {
        for (let index = 0; index < spanElements.length; index++)
        {
            const elem = spanElements[index];
            const word = elem.textContent;
            const startTimeAsString = elem.getAttribute('data-startTime');
            if (!word || !startTimeAsString)
            {
                console.error("Did you assign a word/startTime to this span element?");
                return;
            }

            if (word === hoveredWord[0]) {
                const startTimeInMins = convertToMinutes(hoveredWord[1]);
                const intervalInMins = convertToMinutes(windowWidth);

                startRange = Math.floor(startTimeInMins / intervalInMins) * intervalInMins;
                endRange = startRange + intervalInMins;

                setHighlightedRange([startRange, endRange]);
                break;
            }
        }
    });

    const setHighlight = (() => {
       for (let index = 0; index < spanElements.length; index++)
       {
           const elem = spanElements[index];
           const startTimeInMins = convertToMinutes(elem.getAttribute('data-startTime'));
           if (startTimeInMins < endRange && startTimeInMins >= startRange)
           {
               elem.style.color = 'red';
           }
       }
    });

    resetHighlights();
    if (highlightedRange)
    {
        startRange = highlightedRange[0];
        endRange = highlightedRange[1];
    }else{
        initializeRanges(hoveredWord);
    }

    setHighlight();
}

function setErrorTextVisibility(displayType)
{
    const errorText = document.getElementById("error-text");
    if(errorText)
    {
        errorText.style.display = displayType;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTestData(numItems, startTime, timeLimit = 30 /* Default to 30 minutes */) {
    const testData: any[] = [];
    let currentTime = startTime;

    for (let i = 0; i < numItems; i++) {
        const timeLimitInMS = timeLimit * 60 * 1000;
        const word = 'word' + (i + 1);

        const maxDuration = timeLimitInMS - (currentTime - startTime);
        const duration = getRandomInt(1000, Math.min(maxDuration, 5000));

        const endTime = currentTime + duration;

        testData.push([word, currentTime, endTime]);
        currentTime = endTime + getRandomInt(1000, 5000);
    }

    return testData;
}

function convertToMinutes(timeInMS)
{
    return timeInMS / (60 * 1000);
}

