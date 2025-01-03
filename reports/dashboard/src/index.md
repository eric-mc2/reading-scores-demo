---
toc: false
style: styles.css
---

```js
import {readingdisplot, covdisplot,legend,barplot, tickplot} from './plotting.js';
import {knn, has_dims} from './nearest.js';
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
        <p>
        <b>Source:</b> School-level STAAR assesment scores ("meets grade level") for schools offering 3rd-grade level instruction across Texas.
        </p>
        <p>
        <b>Units:</b> These charts are presented at the zip code level. Each point represents the average within a zip.
        </p>
    </div>
    <div class="tip">
        <ol>
        <li>Type in your community of interest (left) to see their STAAR rank.</li>
        <li>Compare to their rank on various community indicators (right).</li>
        <li>Drill down to similar communities (bottom).</li>
        </ol>
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
    {chooseZip: Inputs.search(data, {
        placeholder: "ZipCode or District Name", 
        columns: ["zip","district_name_unique"], 
        datalist: data.map(d => d.zip),
        required: false}),
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
    ${resize((width) => readingdisplot(data, form, width))}
    ${resize((width) => legend(data, width))}
  </div> 
  <div class="card">
    ${resize((width) => covdisplot(data, form, form.covariate, width))}
  </div>
</div>

```js
const excludeDims = ['reading_min','reading_max','reading_mean','reading_std',
    'zip','district_name_nunique','campus_name_nunique','district_name_unique'
];
const alldims = d3.difference(Object.keys(data[0]), excludeDims);
const dimsInput = Inputs.checkbox(alldims, {label: "Covariates: "});
const dims = Generators.input(dimsInput);
```

<div class="grid grid-cols-2">
    <div class="tip">
        <ol>
        <li>Make sure one single zip code is selected (above).</li>
        <li>Choose one or several community indicators (right).</li>
        <li>Compare your community's rank vs others with similar demographic characteristics.</li>
        </ol>
    </div>
    <div>${dimsInput}</div>
</div>

```js
// Must be separate block from dims.
const pivot = data.filter(d => form.chooseZip.map(dd => dd.zip).includes(d.zip));
const K = 20;
var nn = [];
var no_acs = false;
if ((pivot.length === 1) && (dims.length) && has_dims(pivot[0], dims)) {
    nn = knn(data, pivot[0], K, dims);
} else if ((pivot.length === 1) && (dims.length)) {
    no_acs = true;
}
const nntable = Inputs.table(nn, {
    header: {zip: "ZipCode", district_name_unique: "Districts"}, 
    columns: ["zip","district_name_unique"], 
    format: {
        zip: x => x.toString(),
        district_name_unique: x => x.replace(/[\[\]']/g, ""),
    },
    width: {zip: 60},
    align: {zip: "left", district_name_unique: "left"},
    select: false,
    rows: 20})
```

<div class="grid grid-cols-2" style="grid-template-columns: 1fr 3fr; grid-auto-rows: auto;">
  <div class="card grid-rowspan-2">
    <h2>${K} Most-Similar ZipCodes</h2>
    ${no_acs 
      ? html`<div class="caution" label="Error">No census data for this zip.</div>`
      : nntable}
  </div>
  <div class="card">
    ${(nn.length === 0) 
    ? html`<h2>Reading Scores</h2>` 
    : resize((width) => barplot(nn, pivot[0].zip, width))}
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

<div class="warning" label="Note">
<i>Expecting a scatterplot?</i>

When we see a trend in a scatterplot, we tend to assume the variables are related --
that one directly affects another. Although this relationship may truly exist,
a scatterplot is not proof. Scatterplots force us to focus one variable at a time,
when in reality education outcomes depend on many interrelated factors.

<i>This dashboard does the opposite.</i>

It is designed to emphasize the role of <i>omitted</i>
variables. By finding similar communities, it <i>controls</i>
for one or several economic variables. If the highlighted community is leading or lagging
its peers in education, we must consider two possibilities:

<ol>
<li>The deviation is due to chance.</li>
<li>Another <i>omitted</i> variable is causing the deviation.</li>
</ol>
</div>