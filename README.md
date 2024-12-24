Texas School Reading Scores
==============================

This was an interview take-home project. The prompt was "Make a dashboard for a 
school district leader, comparing reading scores to household income and poverty
at the zip code level. Don't do statistical analysis." Links to
school reading scores, school locations, and zip-level ACS data were provided.

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