import { useEffect, useState } from 'react'
import { Center, Html } from '@react-three/drei'
import PropTypes from 'prop-types'
import './LandingPage.css';
import defaultData from '../general/default_settings.json';
//import AssessmentPage from './AssessmentPage';
import './AssessmentPage.css';
import react, { ReactElement, ReactFragment } from 'react';
import * as d3 from 'd3';
import { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { findDOMNode } from 'react-dom';
import React from 'react';


/**
 * Adds an SVG element of the plot of the data
 * @param svgContainer  The HTML element to attach the SVG to
 * @param data A set of points to plot
 * @param clear  Clears the container before attaching the plot
 */
function Plot(svgContainer, data: Array<[number, number]>, clear?: Boolean) {

    const makePlot = ()=>{
    if(clear && svgContainer){
        // Clear the content of the SVG container before appending new graph
        d3.select(svgContainer).selectAll("*").remove();
    }

    // Set the dimensions of the SVG
    const width = svgContainer.clientWidth; 
    const height = 300;
    const margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };

    const graphWidth = width - (margin.left + margin.right);
    const graphHeight = height - (margin.top + margin.bottom);

    // Create the svg
    const svg = d3.select(svgContainer)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    // Create a sub grouping of graph which is transformed in ward
    const graph = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales for x and y axes
    const xScale = d3.scaleLinear()
    // Domain is set from min to the max range
    // If you are unfamilar with this notation: d=> d[0] is an accessor function
    // Which tells min() to iterate over the first index of the tuple point array ie. runs over the x component
    .domain([d3.min(data, d=> d[0])||0 , d3.max(data, d=> d[0])||0 ])
    // Domain is scaled onto this range
    .range([0, graphWidth]);

    // Don't allow a y axis to start greater than zero but could go below zero
    // This may need to be changed based on the kind of graph you want
    let minY = d3.min(data, d=> d[1])||0;
    if(minY > 0){
        minY = 0;
    }

    const yScale = d3.scaleLinear()
    .domain([d3.min(data, d=> d[1])||0, d3.max(data, d=> d[1])||0 ])
    .range([graphHeight, 0]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append axes to the SVG
    graph.append('g')
    .attr('transform', `translate(${0}, ${graphHeight})`)
    .call(xAxis);

    graph.append('g')
    .attr('transform', `translate(${0}, ${margin.top - margin.bottom})`)
    .call(yAxis);

    // Create and style the plot
    graph.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 2)
    .attr('fill', 'steelblue');

    // Create the line generator function
    const line = d3.line()
    // The point of this is to change how the data is accessed
    // Ie which index to retrieve and how to scale the data
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))
    .curve(d3.curveNatural);

    // Create the line path and append it to the graph
    graph.append('path')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr("id", "svgpath")
    .attr('d', line(data));

    return {line: line, xScale: xScale, yScale: yScale, svg: svg, graph: graph};
    }

    // Create a ResizeObserver instance
    const observer = new ResizeObserver(()=>{
        console.log('resized');
        makePlot();
    });
    
    observer.observe(svgContainer);

    const plotInfo = makePlot();
    const returns = {
        line: plotInfo.line,
        xScale: plotInfo.xScale,
        yScale: plotInfo.yScale,
        svg: plotInfo.svg,
        graph: plotInfo.graph,
        observer: observer
    }
    return returns;
};

/**
 * Calculate the difference between neighbouring values (going backward)
 * @param array 
 * @returns 
 */
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

/**
 * Estimates the probability of finding a value at each x on the graph
 * @param xAxis 
 * @param dataPoints 
 * @param bandWidth 
 * @returns 
 */
function kernelDensityEstimator(xAxis, dataPoints, bandWidth) {

    const kernel = (x) => {
        const absQuotient = Math.abs(x / bandWidth);
        if (absQuotient <= 1) {
            return 0.75 * (1 - absQuotient * absQuotient);
        } else {
            return 0;
        }
    };

    const densityArray = xAxis.map((x) => {
        // Calculate the sum of kernel values
        const sum = dataPoints.reduce((accumulator, dataPoint) => {
            const diff = x - dataPoint;
            return accumulator + kernel(diff);
        }, 0);

        // Divide the sum by the total number of data points and the bandwidth to get the density estimate
        const density = sum / (bandWidth * dataPoints.length);

        // Set the value of the array at this index to the density estimate
        return density;
    });

    return densityArray;
}

/**
 * Medthods for the analysis of speech data, generally does rolling/sliding window analysis
 * @param yAxisData A list of word timmings
 * @param sampleRate The sample quality of the analysis, samples/unit time
 * @param window The window overwhich to count WPM
 * @returns 
 */
async function STTAnalysis(yAxisData, sampleRate, window, bandWidth?){

    const zeroOffset = Math.min(...yAxisData);
    const dataMax = Math.max(...yAxisData);
    const duration = dataMax-zeroOffset; //yAxisData[yAxisData.length-1];

    // # of xSamples = Sample Rate * Duration. Ceil used to return an int that is inclusive of the end point.
    const xSamples = Math.ceil(duration * sampleRate);
    console.log('xSamples: ', xSamples);
    const xAxisData  = new Array(xSamples).fill(0);
    
    // For every sample in x do the following
    const windowedData = xAxisData.map((x, xi)=>{
        // Fill the x-axis with the time of each sample.
        x = zeroOffset + (xi / sampleRate);
        xAxisData[xi] = x;

        const lowerBound = x - window/2;
        const upperBound = x + window/2;
        let count = 0;
        // Run over every data point in y
        yAxisData.map((y, yi)=>{
            // If you are in the window, increase the count
            if(y >= lowerBound && y < upperBound){
                count += 1;
            }
        });

        // Return the count for the current window
        // We need to normalize the array by dividing by the window
        // ie a window twice as large that captures twice as many points will give about the same value as a smaller window
        
        // The window may actually be smaller if the edges of it are cuttof since there is no data at the ends
        // (0 - -5) = 5 ie data starts at 0 but the window tried to sample below that. 5 is the length that was not sampled.
        // Use max to ignore negative values ie where the window was inside the range of the data
        // Repeat this for the upper range and combine to get the amount that the window is outside the range
        // The expresion is flipped/negated because the higher value will be on the other side
        const windCuttoff = Math.max(zeroOffset-lowerBound, 0) + Math.max(-(dataMax-upperBound), 0);
        return count/(window-windCuttoff);
    })

    let densities
    if(bandWidth !== undefined){
        densities = kernelDensityEstimator(xAxisData, yAxisData, bandWidth);
    }

    return (
        {
            xAxis: xAxisData,
            windowedData: windowedData,
            density: densities
        }
    );
}

let displayConversation;



function EndPageMenu({updateAppState, updateConfig, config}) {
    // AppState : const Scene = 1
    // !!Inputs can come in the form of minutes, but config time is always stored as seconds!!

  
    const startApp = () => {
        updateAppState(0)
    }

    const runningTimestamps = useRef<Array<any>>([]);
    const runningTranscript = useRef('');
    const conversation = useRef([]);

    displayConversation = useRef<[ReactElement]>([<></>]);
    const hoverableWords = useRef<[ReactElement]>([<></>]);
    const hoveredWordIndex = useRef(0);

    const plotResizeObserver = useRef<ResizeObserver>();
    const plotRoot = useRef<ReactDOM.Root>();
    const selectedWPM = useRef([0,0]);

    // Listen for a new timestamp transcript
    document.addEventListener('timestampsUpdated', (event)=>{
        console.log('event recieved');
        const data = (event as CustomEvent).detail;
        runningTimestamps.current = data.runningTimestamps;
        conversation.current = data.conversation;

        // Load the running transcript from the timestamps
        runningTranscript.current = '';
        runningTimestamps.current.map((stamp)=>{
            runningTranscript.current += stamp[0];
        });
    });


    const [keyDown, setKeyDown] = useState();
    
    useEffect(() => {
        const keyDownHandler = (e) => {
            setKeyDown(e.key);
        }
        document.addEventListener('keydown', keyDownHandler)
        return () => {
            document.removeEventListener('keydown', keyDownHandler)

        }
    })

    // This maintains the same referance to the SVG
    useEffect(()=>{
    
        console.log('stamp: ', runningTimestamps);

        // This may be slow and we don't want it holding up the API calls so do async
        (async() => {


            const overideArray = [
                ['hello', 1689637761396, 1689637761996],
                ['testing', 1689637762676, 1689637763376],
                ['one', 1689637763496, 1689637763756],
                ['nice', 1689637762335, 1689637762675],
                ['did', 1689637767496, 1689637767676],
                ['you', 1689637767696, 1689637767736],
                ['go', 1689637767816, 1689637767936],
                ['two', 1689637772176, 1689637772436],
                ['three', 1689637773396, 1689637773636],
                ['apple', 1689637776955, 1689637777355],
                ['yes', 1689637781997, 1689637782357],
                ['myself', 1689637788256, 1689637788696],
                ['one', 1689637791796, 1689637791996],
                ['two', 1689637792056, 1689637792296],
                ['three', 1689637792476, 1689637792736],
                ['four', 1689637793296, 1689637793536],
                ['the', 1689637796818, 1689637796858],
                ['twelve', 1689637796938, 1689637797178],
                ['thirteen', 1689637797238, 1689637797538],
                ['fourteen', 1689637797598, 1689637797918],
                ['fifteen', 1689637797978, 1689637798538],
                ['hello', 1689637802016, 1689637802296],
                ['hello', 1689637802396, 1689637802636],
                ['hello', 1689637802736, 1689637802996],
                ['six', 1689637806856, 1689637807036],
                ['seventy', 1689637807116, 1689637807416],
                ['eight', 1689637807536, 1689637807736],
                ['day', 1689637807816, 1689637808076],
                ['ten', 1689637808156, 1689637808376],
                ['eleven', 1689637808436, 1689637808696],
                ['words', 1689637812596, 1689637812916],
                ['for', 1689637813036, 1689637813156],
                ['a', 1689637813256, 1689637813336],
                ['second', 1689637813396, 1689637813716],
                ['two', 1689637816797, 1689637816917],
                ['three', 1689637817037, 1689637817277],
                ['jerry', 1689637823077, 1689637823337]
                ];

            // Overide the timestamps for now !!!
            //runningTimestamps.current = overideArray;

            // Make sure there is data
            if(runningTimestamps.current.length > 0){

                console.log('Stamps: ', runningTimestamps.current);

                // Fill an array with the start time of each word
                const yAxisData = runningTimestamps.current.map((timestamp)=>{
                    // Conversion to seconds may be needed for a different API
                    return (timestamp[1]);

                    // // Replace !!!
                    // return (Math.random() * 50 * 1000);
                });
                
                console.log('Data:');
                console.log(yAxisData);


                // A roungh estimate of what the sample rate should be
                // Is samples/sentance time ex 1 sample per senance time:
                // 2 second for a short sentance
                // 1 / 2 = 0.5 of a second to sample once per sentance
                let sampleRate = 0.5 / 1000;
                const windoWidth = 30 * 1000;

                // It would be very interesting to expose these to the user
                // Restrictions should be placed to prevent long computation
                //const samples = sampleRate * yAxisData.length;
                const samplesMax = 100;
                const samplesMin = 20;
                const yAxisDataMax = Math.max(...yAxisData)-Math.min(...yAxisData);
                const sampleRateMax = samplesMax/yAxisDataMax;
                const sampleRateMin = samplesMin/yAxisDataMax;

                sampleRate = Math.min(Math.max(sampleRate, sampleRateMin), sampleRateMax);

                const speekingData = await STTAnalysis(yAxisData, sampleRate, windoWidth, 10);
                console.log('Analysis: ');
                console.log(speekingData);

                // This div will be altered to contain the graph
                const svgContainer = document.getElementsByClassName("graph-container")[0];

                const xMin = Math.min(...speekingData.xAxis);
                const xMax = Math.max(...speekingData.xAxis);
                const points: Array<[number, number]> = speekingData.xAxis.map((x, xi)=>{
                    // Conver to (x, y) point format
                    // Also x converted to seconds or munites for readability and zero it
                    return [(x-xMin) / 1000, speekingData.windowedData[xi] * 60 * 1000];
                });

                // Unmount the old observer for the plot
                const currentObserver = plotResizeObserver.current;
                if(currentObserver){
                    currentObserver.disconnect();
                }
                // Plot function changes the div to include an SVG graph
                const plotInfo = Plot(svgContainer, points, true);
                // Store the newly mounted observer
                plotResizeObserver.current = plotInfo.observer;

                /**
                 * Get this word's location from the graph
                 * @param i The index of the word
                 * @returns A point as [x, y]
                 */
                const getCoordsFromWordIndex = (i)=>{
                    const xMin = runningTimestamps.current[0][1];
                    let sampledX = runningTimestamps.current[i][1];
                    // Transform in the same way the oringial data was transformed
                    sampledX = (sampledX-xMin) / 1000;

                    // Find the index that splits the data given an x
                    const bisect = d3.bisector((d:any) => d[0]).left;
                    let index = bisect(points, sampledX);
                    
                    // Restrict to the allowed range
                    index = Math.min(Math.max(index, 2), points.length-1);

                    // Interpolate between the previous point and the current one
                    const x0 = points[index - 1][0];
                    const x1 = points[index][0];
                    const y0 = points[index - 1][1];
                    const y1 = points[index][1];
                    const interpolate = d3.interpolateNumber(y0, y1);
                    let retrievedY = interpolate((sampledX - x0) / (x1 - x0));

                    // // Not working correctly currently but should get the y from the curve as it linear interpolation may not match the graph
                    // const path = plotInfo.graph.select('path');
                    // console.log(path);
                    // const totalLength = (path.node() as SVGPathElement).getTotalLength();
                    // const point = (path.node() as SVGPathElement).getPointAtLength(0.5 *totalLength);
                    // console.log('point: ', point);
                    // retrievedY = plotInfo.yScale.invert(point.y);
                    // console.log(retrievedY);

                    return [sampledX, retrievedY];
                }
                
                
                const setHoveredWordIndex = (i, coords) => {
                    hoveredWordIndex.current = i;

                    // This function is additionally being used to set the pointer on the plot
                    // This could be broken up by listening for a change in the hoveredWord index
                    const svg = d3.select(svgContainer);
                    if(svg){
                        
                        // clear out old pointer
                        d3.selectAll('.pointer').remove();
                        const pointer = svg.select('g')
                                        .append('g')
                                            .attr('class', 'pointer')
                                            .append('circle')
                                                .attr('cx', plotInfo.xScale(coords[0]))
                                                .attr('cy', plotInfo.yScale(coords[1]))
                                                .attr('r', 4)
                                                .attr('fill', 'red');
                    }

                    selectedWPM.current = coords;
                }


                // Clear before hand
                // Seems to be having an issue with key in general
                // This is used be react for optimization reasons to idtentify the elements
                hoverableWords.current = [<span key={-1}></span>];
                runningTimestamps.current.map((stamp, i)=>{

                    // Linear interpolation
                    const lerp = (start, end, w) => {
                        return start * (1 - w) + end * w;
                    }

                    /**
                     * Fit a value from its source range to its final range
                     * @param value 
                     * @param sourceMin 
                     * @param sourceMax 
                     * @param targetMin 
                     * @param targetMax 
                     * @returns 
                     */
                    const fit = (value, sourceMin, sourceMax, targetMin, targetMax) => {
                        const sourceRange = sourceMax - sourceMin;
                        const targetRange = targetMax - targetMin;
                        const normalizedValue = (value - sourceMin) / sourceRange;
                        return targetMin + normalizedValue * targetRange;
                    }
                    

                    const coords = getCoordsFromWordIndex(i);
                    // Get a weight from 0 to 1 based on the data set
                    const weight = fit(coords[1], 0, d3.max(points, d => d[1]), 0, 1);

                    // Interpolate between these colours based on the weight
                    // From 0 give the low colour and 1 gives the high colour

                    // It may be better to use a gradient sampling method for finer control
                    const Low = [0, 255/2, 255];
                    const High = [255, 255/2, 0];
                    // Do the linear interpolation from low colour to high colour based on weight
                    const color = Low.map((v, i)=>{
                        return lerp(v, High[i], weight);
                    });

                    // Get the current word and add a space
                    const word = stamp[0] + ' ';

                    // Attach a hover listener function that has i prefilled with the word's index
                    const style = {color: `rgb(${color.join(', ')})`};
                    const element: ReactElement = <span key={i} onMouseEnter={() => setHoveredWordIndex(i, coords)} style={style}>{word}</span>;

                    hoverableWords.current.push(element);
                });

                // This causing issues with rerendering causing mistimed API calls

                // Get the div where the transcript should be filled in
                const transcriptContainer = document.getElementsByClassName("transcript-container")[0];
                // Create a container on DOM
                const containerElement = document.createElement('p');
                // This converts from JSX to standard HTML

                // If a root already exists then unmount it to clear
                if(plotRoot.current !== undefined){

                    plotRoot.current.unmount();
                }
                // Create a new empty root for the container
                plotRoot.current = ReactDOM.createRoot(transcriptContainer);
                // Render the root with the new data
                plotRoot.current.render(hoverableWords.current);
                // Append the container with the elements
                transcriptContainer.appendChild(containerElement);
                console.log('container: ', transcriptContainer);
            }

        })();


        // Clear the elements
        displayConversation.current = [<></>];
        let lastRole = '';
        conversation.current.map((message: any)=>{

            console.log(message.role)
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

    }, [runningTranscript.current]);

    

    // const setDelay = () => {
    //     let checkBox = document.getElementById("setDelay") as HTMLInputElement
    //     updateConfig({...config, setDelay: checkBox.checked})
 
    return <>
    
        {<div className="logoOverlay">
          <img src={require('../images/PALSOL-1.2b-Primary-UBC-Shield.png')} />
          <img src={require('../images/EML_Alternate_colour.png')} />
        </div>}
        {<div className="sideMenuBackground" id="Main">
            <div className="sideMenuInner">
                <div className="sideMenuTitleText">
                    <h1>ASSESSMENT</h1>
                    <div className="hr-1"></div>
                </div>
                <div id="summary" className="drop-down">
                        <p>SUMMARY</p>
                        <div className="inner-box">
                            <div className="transcript-container"></div>
                            <p>WPM: {Math.round(selectedWPM.current[0])||0} at {Math.round(selectedWPM.current[1])||0}s</p>
                            <div className="graph-container"></div>
                        </div>
                    </div>
                <div className="sideMenuContents">
                <div className="buttonFlexBox">
                <button className="button" type="button" id="Start" onClick={(event) => startApp()}> BACK TO START </button>
                </div>
                <div className="inner-box">
                            <div className="full-transcript-container">{displayConversation.current}</div>
                        </div>
                    
                    </div>
                </div>
            </div>
      }

    
    </>
}

export default EndPageMenu;

export function displayConversationValue() {
    if (displayConversation.current) {
      return displayConversation.current;
    } else {
      return null; // or some default value
    }
  }