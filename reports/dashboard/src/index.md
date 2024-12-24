---
toc: false
style: styles.css
---

```js
import {scatter,displot,legend,barplot, tickplot} from './plotting.js';
import {knn} from './nearest.js';
```

```js
const data = FileAttachment("data/scores.csv").csv({typed: true});
```

<!-- Title -->

<div class="hero">
  <h1>3rd Grade Reading Scores</h1>
  <h2>Comparison to community economic indicators.</h2>
</div>

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

<div class="grid grid-cols-2">
    <div class="note" label="">
        <b>Source:</b> School-level STAAR assesment scores ("meets grade level") for schools offering 3rd-grade level instruction across Texas.
    </div>
    <div class="tip">
        Start by comparing
    </div>
</div>

```js
const covariates = [
    "median_family_income", 
    "percent_below_poverty", 
    'percent_below_poverty_minors',
    'percent_below_poverty_black',
    'percent_below_poverty_hispanic']
const form = view(Inputs.form(
    {chooseZip: Inputs.search(data, {placeholder: "Highlight zipcode", columns: ["zip"], required: false}),
     covariate: Inputs.select(covariates, {value: "median_family_income", label: "Covariate"})},
     {template: ({chooseZip, covariate}) => htl.html`
        <div class="grid grid-cols-2">
        <div>${chooseZip}</div>
        <div>${covariate}</div>
        </div>
     `}
));
```

<!-- Scatter plots -->

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => displot(data, form, width))}
    ${resize((width) => legend(data, width))}
  </div> 
  <div class="card">
    ${resize((width) => scatter(data, form, width, {cov: form.covariate}))}
  </div>
</div>

## Compare to similar communities

```js
const excludeDims = ['reading_min','reading_max','reading_mean','reading_std',
    'zip','district_name_nunique','campus_name_nunique'
];
const alldims = d3.difference(Object.keys(data[0]), excludeDims);
const dims = view(Inputs.checkbox(alldims, {label: "Choose similar zipcodes by: "}));
```

```js
// Must be separate block from dims.
const pivot = data.filter(d => form.chooseZip.map(dd => dd.zip).includes(d.zip));
// Display as table for debugging.
// const nn = (pivot.length === 1) && (dims.length) ? view(Inputs.table(knn(data, pivot[0], 10, dims))) : undefined;
const K = 20;
var nn = [];
if ((pivot.length === 1) && (dims.length)) {
    nn = knn(data, pivot[0], K, dims);
}
const nntable = Inputs.table(nn, {
    header: {zip: ""}, 
    columns: ["zip"], 
    format: {zip: x => x.toString()},
    select: false,
    rows: 20})

// const tickplots = (nn.length === 0) ? [] : resize((width) => tickplot(nn, pivot[0].zip, width));
// const tickplots = (nn.length === 0) ? [] : tickplot(nn, pivot[0].zip);
```

<div class="grid grid-cols-2" style="grid-template-columns: 1fr 3fr; grid-auto-rows: auto;">
  <div class="card grid-rowspan-2">
    <h2>${K} Most-Similar ZipCodes</h2>
    ${view(nntable)}
  </div>
  <div class="card">
    ${(nn.length === 0) ? html`<h2>Reading Scores</h2>` : resize((width) => barplot(nn, pivot[0].zip, width))}
  </div>
  <div class="card">
    <h2>Compare Community Indicators</h2>
    ${(nn.length === 0) 
    ? html`<p></p>`
    : resize((width) => {
      const plots = tickplot(nn, pivot[0].zip, dims, width);
      return html`<div class="plots-container">${plots}</div>`
    })
    }
  </div>
</div>
