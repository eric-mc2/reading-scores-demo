import * as d3 from "npm:d3";

export function distance(x, y, dims) {
    if (x === undefined) {
        return 0;
    }
    const diffs = dims.map(i => x[i] - y[i]);
    const diffsq = diffs.map(d => d*d);
    return d3.sum(diffsq);
}

export function knn(data, pivot, k, dims) {
    return d3.sort(
        data, 
        (d) => distance(d, pivot, dims)).slice(0,k)
}