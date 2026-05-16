# Cricket-Score-Predictor-

An engaging cricket score prediction tool created for an Upwork freelancing project. It calculates projected scores based on wickets, runs at tea/drinks, temperature, and team dynamics.

## 2026 Refresh Highlights
- Better UX with cleaner layout and improved mobile-friendly grid form.
- Safer input validation and user-facing error messages for realistic value ranges.
- New prediction scenario cards: **Conservative**, **Most Likely**, and **Aggressive**.
- Added run-rate insight summary to explain the projected finish.
- Improved chart behavior by destroying old Chart.js instances before creating new ones.

## Features
- Match format toggle:
  - Two-day (75 overs)
  - One-day (40 overs)
- Dynamic score prediction using:
  - Wickets down
  - Runs at tea/drinks
  - Temperature (fatigue adjustment)
  - Cross bat hacks (discipline adjustment)
- Charted score progression by over.

## Tech Stack
- HTML5
- CSS3
- JavaScript
- Chart.js

## How to Run
1. Clone the repo.
2. Open `index.html` in your browser.
3. Enter match conditions and click **Predict Score**.

## Future Upgrades
- Store match sessions in local storage or backend.
- Add downloadable report (PDF/CSV).
- Support second-innings chase projections.
