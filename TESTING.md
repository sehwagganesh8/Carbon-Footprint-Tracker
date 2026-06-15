# Testing Guidelines

## Unit & Integration
This project utilizes Vitest alongside React Testing Library. We enforce a strict **90% coverage threshold** across statements, branches, and functions for all core logic and components.

## Running Tests
Run \`npm run test\` to trigger the standard vitest suite.
Run \`npm run test:coverage\` to generate coverage reports.

## CI/CD
Our GitHub Actions pipeline automatically rejects any PR dropping coverage below 90%.
