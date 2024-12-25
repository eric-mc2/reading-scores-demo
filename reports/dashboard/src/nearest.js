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
    return d3.sort(
        data.filter(d => has_dims(d, dims)), 
        (d) => distance(d, pivot, dims)).slice(0,k)
}