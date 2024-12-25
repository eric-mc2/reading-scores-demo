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

function displotdata(data, inputs, dim) {
    // Sort by Y value to show bell curve.
    const dataCopy = data.map(d => ({ ...d }));
    const rank = d3.sort(d3.range(data.length), (i) => data[i][dim]);
    rank.forEach((originalIndex, newIndex) => {
        dataCopy[originalIndex].rank = 100 * newIndex / data.length;
    });
    const dataFiltered = dataCopy.filter(d => inputs.chooseZip.map(dd=>dd.zip).includes(d.zip));
    return {dataCopy, dataFiltered}
}

export function readingdisplot(data, inputs, width) {
    const datas = displotdata(data, inputs, "reading_mean")
    return Plot.plot({
        title: "Distribution of Reading Scores",
        width: width,
        height: 200,
        marks: [
            Plot.dot(datas.dataCopy, {x: "rank", y: "reading_mean"}),
            Plot.dot(datas.dataFiltered, {x: "rank", y: "reading_min", symbol: "triangle2"}),
            Plot.dot(datas.dataFiltered, {x: "rank", y: "reading_max", symbol: "diamond2"}),
            Plot.dot(datas.dataFiltered, {x: "rank", y: "reading_mean", fill:"gold", stroke: "gold"}),
            Plot.axisX({label: "Rank"}),
            Plot.axisY({label: "% Meets Grade Level"}),
        ],
    })
}

export function covdisplot(data, inputs, dim, width) {
    const datas = displotdata(data, inputs, dim);
    return Plot.plot({
        title: `Distribution of ${dim}`,
        width: width,
        height: 200,
        marks: [
            Plot.dot(datas.dataCopy, {x: "rank", y: dim}),
            Plot.dot(datas.dataFiltered, {x: "rank", y: dim, fill:"gold", stroke: "gold"}),
            Plot.axisX({label: "Rank"}),
            Plot.axisY({label: dim}),
        ],
    })
}

export function barplot(data, highlight, width) {
    const dataFiltered = data.filter(d => d.zip === highlight);

    return Plot.plot({
        title: "Compare Scores",
        width: width,
        height: 200,
        marks: [
            Plot.barY(data, {x: "zip", y: "reading_mean", sort: {x: "y"}}),
            Plot.barY(dataFiltered, {x: "zip", y: "reading_mean", sort: {x: "y"}, fill:"gold", stroke: "gold"}),
            Plot.axisX({tickFormat: x => x.toString(), label: ""}),
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