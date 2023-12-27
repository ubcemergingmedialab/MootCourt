/*
import './AssessmentPage.css';
import React, {ReactElement, useEffect, useRef, useState} from 'react';
import LinePlot from './linePlot';

const GraphPlot = (data) => {
    const [chart, setChart] = useState<LinePlot | null>(null);

    useEffect(() => {
        if (!data || data.length === 0)
        {
            console.error("No data to display");
        }

        //some code here
    }, [data, chart]);

    return (
        <div className="linePlot">
            <div id="vis-lineplot"/>
        </div>
    );
}


function Page()
{
    const [points, setPoints] = useState<Array<[number, number]>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const newDataPoints: Array<[number, number]> = [[1, 10], [2, 20], [3, 30]];
            setPoints(newDataPoints);
        };

        fetchData();
    }, [// some code here]);

    return (
        <div>
            {<GraphPlot data={points} />}
        </div>
    )
}*/
