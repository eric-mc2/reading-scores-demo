---
toc: false
style: styles.css
---

<div class="hero">
  <h1>3rd Grade Reading Scores</h1>
  <h2>Comparison of community economic indicators vs "meets grade level" rate in Texas schools.</h2>
</div>


<!-- Load and transform the data -->

```js
const data = FileAttachment("data/scores.csv").csv({typed: true});
```

<!-- Cards with big numbers -->

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Schools</h2>
    <span class="big">${d3.sum(data, d => d.campus_name_nunique)}</span>
  </div>
  <div class="card">
    <h2>Districts</h2>
    <span class="big">${d3.sum(data, d => d.district_name_nunique)}</span>
  </div>
  <div class="card">
    <h2>ZipCodes</h2>
    <span class="big">${data.length}</span>
  </div>
</div>

<!-- Scatter plots -->

```js
const covariates = [
    "median_family_income", 
    "percent_below_poverty", 
    'percent_below_poverty_minors',
    'percent_below_poverty_black',
    'percent_below_poverty_hispanic']
const form = view(Inputs.form(
    {chooseZip: Inputs.search(data, {placeholder: "Highlight zipcode", columns: ["zip"],required: false}),
     covariate: Inputs.select(covariates, {value: "median_family_income", label: "Covariate"})},
     {template: ({chooseZip, covariate}) => htl.html`
        <div class="grid grid-cols-2">
        <div>${chooseZip}</div>
        <div>${covariate}</div>
        </div>
     `}
));
```

```js
function myscatter(data, {width} = {}, {cov} = "median_family_income") {
    const dataFiltered = data.filter(d => form.chooseZip.map(dd=>dd.zip).includes(d.zip));
    return Plot.plot({
        title: "Community factors",
        width,
        marks: [
            Plot.dot(data, {x: cov, y: "reading_mean"}),
            Plot.dot(dataFiltered,{x: cov, y: "reading_mean", fill:"gold", stroke: "gold"}),
            Plot.axisY({label: "% Meets Grade Level"}),
            Plot.axisX({label: cov.replace(/_/g," ")})
        ],
        grid: true
    })
}
function mydisplot(data, {width} = {}) {
    // Sort by Y value to show bell curve.
    const dataCopy = data.map(d => ({ ...d }));
    const sortIndex = d3.sort(d3.range(data.length), (i) => data[i].reading_mean);
    sortIndex.forEach((originalIndex, newIndex) => {
        dataCopy[originalIndex].sortIndex = 100 * newIndex / data.length;
    });
    const dataFiltered = dataCopy.filter(d => form.chooseZip.map(dd=>dd.zip).includes(d.zip));

    return Plot.plot({
        title: "Distribution of Scores",
        width,
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
```

```js
function mylegend({width} = {}) {
    const legendSymbols = [
        {"symbol": "circle", "label":"mean"}, 
        {"symbol": "triangle2", "label":"min"},
        {"symbol": "diamond2", "label":"max"}
    ]
    return Plot.plot({
        title: "Legend:",
        width,
        label: null,
        marks: [
            Plot.dotX(legendSymbols, {x: "label", symbol: "symbol"}),
        ],
    })
}
```

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => mydisplot(data, {width}))}
    ${resize((width) => mylegend(data,{width}))}
  </div> 
  <div class="card">
    ${resize((width) => myscatter(data, {width}, {cov: form.covariate}))}
  </div>
</div>