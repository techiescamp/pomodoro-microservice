
## Overview

This document provides a technical explanation of how the Weekly Report and Monthly Report are generated using React and Chart.js. The reports visualize user productivity data based on completed tasks.

## Weekly Report

### Purpose

The Weekly Report displays the number of completed tasks per day within a given week using a bar chart.

The task data is fetched from an API `/api/getAllTasks` using axios when the compnent mounts.


### Chart Configuration

1. Uses Bar component from react-chartjs-2.

2. X-axis represents task completion dates.

3. Y-axis represents total focus time per day. Calculates the total focus time (act * timer) per day.

4. Data is visualized in a bar chart with a red color scheme.
