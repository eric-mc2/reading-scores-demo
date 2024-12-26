Texas School Reading Scores
==============================

View app on [Observable Cloud](https://reading-scores-demo.observablehq.cloud/3rd-grade-reading-scores/)

This was an interview take-home project. The prompt was "Make a dashboard for a 
school district leader, comparing reading scores to household income and poverty
at the zip code level. Don't do statistical analysis." Links to
school reading scores, school locations, and zip-level ACS data were provided.

Features
----

![Demo](demo.gif)

* Search by zip or school district name.
* Pick covariates to find k nearest neighbors (similar communities).
* Highlight community of interest's rank, state-wide and vs neighbors.
* Designed to compare economic indicators to outcomes without suggesting causal relationships.

Project Structure
-----------------

```
.
├── AUTHORS.md
├── LICENSE
├── README.md
├── data                    <- (not tracked by git. maybe tracked by DVC)
│   ├── raw                 <- The original, immutable data dumps from primary or third-party sources.
│   ├── interim             <- Intermediate data that has been transformed.
│   ├── final               <- The final, canonical data sets for modeling.
├── pipeline                <- The actual data ETL process (a NUMBERED mix of scripts and notebooks)
└── reports                 <- For all non-data project outputs
    └── dashboard           <- Source code for Observable Framework app
```