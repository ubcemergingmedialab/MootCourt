import * as d3 from 'd3';
import './AssessmentPage.css';

/**
 * Adds an SVG element of the plot of the data
 * @param svgContainer  The HTML element to attach the SVG to
 * @param data A set of points to plot
 * @param clear  Clears the container before attaching the plot
 */
export default class LinePlot {
    constructor(_config, _data, _dispatcher, _interval)
    {
        this.config = {
            parentElement : _config.parentElement,
            containerWidth: _config.containerWidth || 780,
            containerHeight: _config.containerHeight || 500,
            tooltipPadding: 15,
            margin: _config.margin || {
                top: 30,
                bottom: 50,
                left: 60,
                right: 50
            }
        };
        this.data = _data;
        this.dispatcher = _dispatcher;
        this.interval = _interval;
        this.highlightedRange = null;
        this.initVis();
    }

    initVis()
    {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr("width", vis.config.containerWidth)
            .attr("height", vis.config.containerHeight);

        vis.chart = vis.svg
            .append("g")
            .attr("transform",`translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.xScale = d3.scaleLinear()
            .domain([d3.min(vis.data, d=> d[0])||0, d3.max(vis.data, d=> d[0])||0 ])
            .range([0, vis.width - 30]);

        vis.yScale = d3.scaleLinear()
            .domain([d3.min(vis.data, d=> d[1])||0, d3.max(vis.data, d=> d[1])||0 ])
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSize(0)
            .tickPadding(10);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .tickSize(3)
            .tickSizeOuter(0);

        vis.xAxisGroup = vis.chart.append('g')
            .attr('transform', `translate(0, ${vis.height})`)
            .style('font-size', '14px');

        vis.yAxisGroup = vis.chart.append('g')
            .style('font-size', '14px');

        vis.xAxisGroup.append('text')
            .attr('class', "axis-label axis-label-x")
            .text('Time (mins)')
            .attr("fill", "black")
            .attr("transform",`translate(${vis.width + 10}, 0)`)
            .style("font-size", 14);

        vis.yAxisGroup.append('text')
            .attr('class', "axis-label axis-label-y")
            .text("Words per Interval")
            .attr("fill", "black")
            .attr("transform", `translate(${vis.config.margin.left}, -15)`)
            .style("font-size", 14);

        vis.updateVis();
    }

    updateVis()
    {
        let vis = this;

        vis.xScale.domain([d3.min(vis.data, d=> d[0])||0, d3.max(vis.data, d=> d[0])||0 ]);
        vis.yScale.domain([d3.min(vis.data, d=> d[1])||0, d3.max(vis.data, d=> d[1])||0 ]);
        vis.renderVis();
    }

    renderVis()
    {
        let vis = this;

        vis.chart
            .selectAll(".point-circle")
            .data(vis.data)
            .join("circle")
            .attr('class', 'point-circle')
            .attr("cx", (d) => vis.xScale(d[0]))
            .attr("cy", (d) => vis.yScale(d[1]))
            .attr("r", 7)
            .attr("fill", "steelblue")
            .attr("fill-opacity", 0.6)
            .classed('hovered', d => {
                if (vis.highlightedRange === null)
                {
                    return false;
                }
                return d[0] >= vis.highlightedRange[0] && d[0] < vis.highlightedRange[1];
            })
            .on("mouseover", (event, d) => {
                const range = vis.getStartAndEndRange(d[0], vis.interval);
                if (d3.select(event.currentTarget).classed("hovered") === false)
                {
                    vis.chart.selectAll(".point-circle").classed('hovered', false);
                    d3.select(event.currentTarget).classed('hovered', true);

                    vis.highlightedRange = range;
                    vis.dispatcher.call('highlightedRange', event, vis.highlightedRange);
                }

                d3.select('#lineplot-tooltip')
                    .style('opacity', 1)
                    .html(`
                    <div class="lineplot-tooltip-label">Range: ${range[0].toFixed(2)} - ${range[1].toFixed(2)} mins</div>
                    <div class="lineplot-tooltip-label">WPI: ${d[1].toFixed(2)}</div>
                    <div class="lineplot-tooltip-label">Start Time: ${d[0].toFixed(2)} mins</div>
                    `);
            })
            .on("mousemove", (event) => {
                const parentContainer = document.getElementById("assessment-page");
                const parentRect = parentContainer.getBoundingClientRect();

                d3.select("#lineplot-tooltip")
                    .style("left", (event.pageX - parentRect.left + vis.config.tooltipPadding - 100) + "px")
                    .style("top", (event.pageY - parentRect.top + vis.config.tooltipPadding) + "px");
            })
            .on("mouseleave", () => {
                d3.select("#lineplot-tooltip").style("opacity", 0);
            })
            .transition()
            .duration(500);


        const line = d3
            .line()
            .x((d) => vis.xScale(d[0]))
            .y((d) => vis.yScale(d[1]))
            .curve(d3.curveLinear);

        vis.chart
            .selectAll(".line-plot")
            .data([vis.data])
            .join("path")
            .attr('class', 'line-plot')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line)
            .raise()
            .transition()
            .duration(500);

        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }

   /* // Create a ResizeObserver instance
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
    return returns;*/
    convertToMinutes(timeInMS)
    {
        return timeInMS / (60 * 1000);
    }
    getStartAndEndRange(startTime, interval)
    {
        let vis = this;
        const intervalInMins = vis.convertToMinutes(interval);

        const start = Math.floor(startTime/intervalInMins) * intervalInMins;
        const end = start + intervalInMins;
        return [start, end];
    }
};