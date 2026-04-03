# DeepBlue

DeepBlue is a premium personal portfolio website for a market analyst focused on stocks, sectors, narratives, momentum, sentiment shifts, and structural market behavior.

The site is written in a first-person voice and framed as a personal analysis studio rather than an academic or institutional project.

## Pages

- `index.html` - home page with positioning, tracked themes, recent analysis, and a projection preview
- `about.html` - philosophy page explaining how the analyst distinguishes signal from noise
- `methodology.html` - framework page outlining the analytical process
- `literature.html` - main analysis hub with filters and a projection lab
- `themes.html` - trend map grouped by phase
- `insights.html` - selected calls and case studies
- `portfolio.html` - contact and portfolio context

## Project structure

- `assets/style.css` - global design system and responsive layout
- `assets/js/data.js` - brand, themes, watchlist data, analysis entries, and case studies
- `assets/js/site.js` - shared header/footer, logo helpers, reveal behavior, and projection utilities
- `assets/js/home.js` - home page rendering
- `assets/js/about.js` - philosophy page rendering
- `assets/js/methodology.js` - framework page rendering
- `assets/js/archive.js` - analysis archive filters and projection lab
- `assets/js/themes.js` - trend map rendering
- `assets/js/insights.js` - case-study rendering
- `assets/js/portfolio.js` - contact page rendering
- `assets/images/deepblue-hero.svg` - custom hero illustration

## Notes on logos and projections

- Stock logo badges use external company-logo image URLs with local ticker fallbacks if the image does not load.
- Projection charts are browser-rendered SVG scenario paths based on the analyst's thesis framework. They are illustrative scenario maps, not live market data feeds.

## Running locally

Serve the folder with any static server. For example:

```bash
py -m http.server 8123
```

Then open:

```text
http://127.0.0.1:8123/index.html
```
