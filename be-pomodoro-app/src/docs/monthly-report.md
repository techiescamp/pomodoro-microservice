## Overview

This document provides a technical explanation of how the Weekly Report and Monthly Report are generated in the TChart component using React and Chart.js. The reports visualize user productivity data based on completed tasks.

## Monthly Report

### Purpose

The Monthly Report aggregates the total focus time per month over a selected year and visualizes it in a bar chart.

The same API call as we did for weekly report chart `/api/getAllTasks` retrieves the full task dataset.

### Chart Configuration

1. Uses Bar component from react-chartjs-2.

2. X-axis represents months (Jan-Dec).

3. Y-axis represents total focus time per month.

4. Data is visualized in a bar chart with a green color scheme.

5. Users can switch between years using a dropdown.
