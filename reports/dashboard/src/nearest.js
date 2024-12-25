import * as d3 from "npm:d3";

function distance(x, y, dims) {
    if (x === undefined) {
        return 0;
    }
    const diffs = dims.map(i => x[i] - y[i]);
    const diffsq = diffs.map(d => d*d);
    return d3.sum(diffsq);
}

export function has_dims(x, dims) {
    return d3.sum(dims.map(i => i in x && x[i] !== undefined && x[i] !== null)) === dims.length;
}

export function knn(data, pivot, k, dims) {
    // Have to put all data onto similar scale. 
    // Otherwise this will prioritize closeness to larger-scaled data.
    const filteredData = data.filter(d => has_dims(d, dims));

    const scales = dims.map(dim => d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d[dim]))
        .range([0, 1]));

    const scaledData = filteredData.map(d => ({
        ...d,
        ...Object.fromEntries(dims.map((dim, i) => [dim, scales[i](d[dim])])),
    }));
    const scaledPivot = Object.fromEntries(
        dims.map((dim, i) => [dim, scales[i](pivot[dim])])
    );

    const sortIndex = d3.range(filteredData.length)
        .sort((a, b) => d3.ascending(distance(scaledData[a], scaledPivot, dims),
                                     distance(scaledData[b], scaledPivot, dims)));
   
    const topK = sortIndex.slice(0, k).map(i => filteredData[i]);
    return topK;
}