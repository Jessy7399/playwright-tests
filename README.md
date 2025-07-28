## Playwright Test Suite

This repository contains Playwright automated tests for a sample React + Node.js web application.

## Prerequisites

- Node.js
- npm
- The sample web app running locally:
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:8080

## Setup

1. Clone this repository:
   git clone https://github.com/Jessy7399/playwright-tests.git
   cd playwright-tests
## Dependencies:
npm install
Ensure your React frontend and Node.js backend servers are running locally on ports 3000 and 8080, respectively.

## Running Tests
To run all Playwright tests with the headed browser (for UI test observation):
npx playwright test --headed
npx playwright test

##Report
npx playwright show-report --port 9330
