# UI Automated Testing with Cypress (Saucedemo)

This repository contains automated UI tests for [Saucedemo](https://www.saucedemo.com/) using Cypress.

## Requirements
- Node.js (with npm)
- Cypress

## Installation
1. Clone the repository.
2. Navigate to the project folder:
   ```bash
   cd ui-testing-assignment
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running Tests
To run tests in headless mode:
```bash
npx cypress run
```

To open the Cypress Test Runner:
```bash
npx cypress open
```

## Test Cases Covered
1. **Valid Login**: Verifies that a valid user can log in.
2. **Invalid Login**: Verifies that a locked-out user receives an error message.
3. **User Action (Add to Cart)**: Verifies that adding an item to the cart updates the cart badge.
4. **Logout**: Verifies that the user can safely log out.
