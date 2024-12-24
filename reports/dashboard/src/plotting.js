import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {html} from "npm:htl";

export function scatter(data, inputs, width, {cov} = "median_family_income") {
    const dataFiltered = data.filter(d => inputs.chooseZip.map(dd=>dd.zip).includes(d.zip));
    return Plot.plot({
        title: "Community factors",
        width: width,
        marks: [
            Plot.dot(data, {x: cov, y: "reading_mean"}),
            Plot.dot(dataFiltered,{x: cov, y: "reading_mean", fill:"gold", stroke: "gold"}),
            Plot.axisY({label: "% Meets Grade Level"}),
            Plot.axisX({label: cov.replace(/_/g," ")})
        ],
        grid: true
    })
}

export function displot(data, inputs, width) {
    // Sort by Y value to show bell curve.
    const dataCopy = data.map(d => ({ ...d }));
    const sortIndex = d3.sort(d3.range(data.length), (i) => data[i].reading_mean);
    sortIndex.forEach((originalIndex, newIndex) => {
        dataCopy[originalIndex].sortIndex = 100 * newIndex / data.length;
    });
    const dataFiltered = dataCopy.filter(d => inputs.chooseZip.map(dd=>dd.zip).includes(d.zip));

    return Plot.plot({
        title: "Distribution of Scores",
        width: width,
        marks: [
            Plot.dot(dataCopy, {x: "sortIndex", y: "reading_mean"}),
            Plot.dot(dataFiltered, {x: "sortIndex", y: "reading_min", symbol: "triangle2"}),
            Plot.dot(dataFiltered, {x: "sortIndex", y: "reading_max", symbol: "diamond2"}),
            // Plot.link(dataFiltered, {x1: "sortIndex", x2: "sortIndex", y1:0, y2:100, stroke: "gold"}),
            // Plot.link(dataFiltered, {x1: 0, x2: 100, y1:"reading_mean", y2:"reading_mean", stroke: "gold"}),
            Plot.dot(dataFiltered, {x: "sortIndex", y: "reading_mean", fill:"gold", stroke: "gold"}),
            Plot.axisX({label: "Rank"}),
            Plot.axisY({label: "% Meets Grade Level"}),
        ],
    })
}

export function barplot(data, highlight, width) {
    const dataCopy = data.map(d => ({ ...d }));
    const sortIndex = d3.sort(d3.range(data.length), (i) => data[i].reading_mean);
    sortIndex.forEach((originalIndex, newIndex) => {
        dataCopy[originalIndex].sortIndex = 100 * newIndex / data.length;
    });
    const dataFiltered = dataCopy.filter(d => d.zip === highlight);

    return Plot.plot({
        title: "Compare Scores",
        width: width,
        height: 200,
        marks: [
            Plot.barY(dataCopy, {x: "sortIndex", y: "reading_mean"}),
            Plot.barY(dataFiltered, {x: "sortIndex", y: "reading_mean", fill:"gold", stroke: "gold"}),
            Plot.axisX({ticks: [], label: "Similar ZipCodes"}),
            Plot.axisY({label: "% Meets Grade Level"}),
        ],
    })
}

export function tickplot(data, highlight, dims, width) {
    const dataFiltered = data.filter(d => d.zip === highlight);
    return dims.map(dim => {
        return Plot.plot({
            width: width, 
            x: dim.includes("percent") ? {domain: [0,100]} : {},
            marks: [
                Plot.tickX(data, {x: dim}),
                Plot.tickX(dataFiltered, {x: dim, stroke: "gold"}),
                Plot.axisX({label: dim.replace(/_/g," ")})
            ],
        })
    });
}

export function legend({width} = {}) {
    const legendSymbols = [
        {"symbol": "circle", "label":"mean"}, 
        {"symbol": "triangle2", "label":"min"},
        {"symbol": "diamond2", "label":"max"}
    ]
    return Plot.plot({
        title: "Legend:",
        width: width,
        label: null,
        marks: [
            Plot.dotX(legendSymbols, {x: "label", symbol: "symbol"}),
        ],
    })
}