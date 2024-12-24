---
toc: false
style: styles.css
---

```js
import {scatter,displot,legend} from './plotting.js';
```

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

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => displot(data, form, {width}))}
    ${resize((width) => legend(data, {width}))}
  </div> 
  <div class="card">
    ${resize((width) => scatter(data, form, {width}, {cov: form.covariate}))}
  </div>
</div>