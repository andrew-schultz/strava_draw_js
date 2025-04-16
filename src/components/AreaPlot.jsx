import * as d3 from "d3";
import { useEffect, useRef } from "react";

const getStreamByType = (streams, streamType) => {
    const stream = streams.filter(s => s['stream_type'] === streamType)
    return stream[0]
}

const AreaPlot = ({uuid, activityStreams, streamType, yType}) => {
        // yType will be 'distance' or 'time'

        const ref = useRef();


        // Specify the chart’s dimensions.
        const width = 928;
        const height = 500;
        const marginTop = 20;
        const marginRight = 12;
        const marginBottom = 30;
        const marginLeft = 30;
        // debugger
        const distance = getStreamByType(activityStreams, 'distance')
        const streamData = getStreamByType(activityStreams, streamType)
        // Create the temporal scale.
        // d3.scaleLinear(domain = total list of values/data, range = range from )
        // const x = d3.scaleLinear(activityStreams[streamType]['data'], [0, activityStreams[yType]['original_size']])

    // debugger
    
        const x = d3.scaleLinear()
            .domain(d3.extent(distance['data']))
            .range([marginLeft, width - marginRight]);
    
        // Count the events by day.
        // const bins = d3.bin()
        //     .domain(x.domain())
        //     .thresholds(x.ticks(d3.timeDay))
        //     (dates);
    
        // Apply the moving-average transform.
        // const values = movingAverage(bins.map(d => d.length), N);
        const values = streamData['data']
    
        // Create the vertical scale.
        const y = d3.scaleLinear()
            .domain([0, d3.max(streamData['data'])]).nice()
            .rangeRound([height - marginBottom, marginTop]);
    
        // Create the container SVG.
        // const svg = d3.create("svg")
        //     .attr("viewBox", [0, 0, width, height])
        //     .attr("width", width)
        //     .attr("height", height)
        //     .attr("style", "max-width: 100%; height: auto;");

        // Get the svg el
        const svg = d3.select("#areachart").select("svg").select("g");
    
        // Append the axes.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));
        
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width)
                .attr("stroke-opacity", 0.1));
    
        // Append the area. Ignore invalid values due to an incomplete window
        // at the start of the time period.
        const area = d3.area()
            .defined(d => !isNaN(d))
            .x((d, i) => x(distance['data'][i].x0))
            .y0(y(0))
            .y1(y);
    
        svg.append("path")
            .attr("fill", "steelblue")
            .attr("d", area(distance['data']));
    
        // return svg.node();

    return (
        <div>
            <svg width={600} height={500} id="areachart" ref={ref} />;
            {/* <svg></svg> */}
        </div>
    )
} 

export default AreaPlot
