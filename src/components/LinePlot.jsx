import * as d3 from "d3";
import {useRef, useEffect} from "react";

const LinePlot = ({
    data,
    xData,
    // width = 640,
    // height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30,
    marginLeft = 40
}) => {
    const gx = useRef();
    const gy = useRef();
    const width = window.innerWidth - 20.0;
    const height = 100;
    // meters to miles 
    // 1 meter = 0.0006213712 miles
    const maxX = d3.extent(xData)
    const maxDistance = maxX[1] * 0.0006213712
    console.log('md', maxDistance)

    const yBig = d3.extent(data)
    const formattedData = []
    data.forEach(d => {
        // meter to feet
        // 1 meter = 3.280839895 feet
        const fD = d * 3.280839895
        formattedData.push(fD)
    })
    // debugger
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(formattedData), [height - marginBottom, marginTop]);

    // const y = d3.scaleLinear(d3.extent(formattedData), [height - marginBottom, marginTop]);
    const line = d3.line((d, i) => x(i), y);

    // Declare the area generator.
    const area = d3.area()
        .x((d, i) => x(i))
        .y0(y(0))
        .y1(d => y(d));
    

    useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
    useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);

    return (
        <svg width={width} height={height}>
            {/* <g ref={gx} transform={`translate(0,${height - marginBottom})`} /> */}
            {/* <g ref={gy} transform={`translate(${marginLeft},0)`} /> */}
            <path fill="white" stroke="white" strokeWidth="1.5" opacity="0.5" d={area(formattedData)} />
            <path fill="none" stroke="white" strokeWidth="1.5" d={line(formattedData)} />

            
            {/* <g fill="none" stroke="currentColor" strokeWidth="1.0">
                {data.map((d, i) => (<circle key={i} cx={x(i)} cy={y(d)} r="0.5" />))}
            </g> */}
        </svg>
    );
}

export default LinePlot