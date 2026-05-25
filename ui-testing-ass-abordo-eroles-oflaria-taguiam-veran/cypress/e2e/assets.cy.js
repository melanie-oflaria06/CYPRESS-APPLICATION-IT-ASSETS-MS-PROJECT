describe('IT-ASSET-MS UI Automated Testing', () => {

  beforeEach(() => {
    // Clear localStorage to ensure a clean state
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('TC01 - Valid Login', () => {
    // Input valid credentials (mocked in Login.jsx)
    cy.get('[data-test="username"]').type('admin')
    cy.get('[data-test="password"]').type('password123')
    cy.get('[data-test="login-button"]').click()

    // Assert that we are on the dashboard
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('IT ASSET MS').should('be.visible')
  })

  it('TC02 - Invalid Login', () => {
    // Input invalid credentials
    cy.get('[data-test="username"]').type('wrong_user')
    cy.get('[data-test="password"]').type('wrong_pass')
    cy.get('[data-test="login-button"]').click()

    // Assert that error message is displayed
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error"]').should('contain', 'Invalid username or password')
  })

  it('TC03 - User Action (Browse Assets)', () => {
    // Valid login
    cy.get('[data-test="username"]').type('admin')
    cy.get('[data-test="password"]').type('password123')
    cy.get('[data-test="login-button"]').click()

    // Navigate to Assets page
    cy.contains('Asset List').click()

    // Assert that assets are visible (check for common text or table headers)
    cy.url().should('include', '/assets')
    cy.get('table').should('be.visible')
  })

  it('TC04 - Logout', () => {
    // Valid login
    cy.get('[data-test="username"]').type('admin')
    cy.get('[data-test="password"]').type('password123')
    cy.get('[data-test="login-button"]').click()

    // Click Logout button in the sidebar
    cy.get('[data-test="logout-button"]').click()

    // Assert that we are back on the login page
    cy.url().should('include', '/login')
    cy.get('[data-test="login-button"]').should('be.visible')
  })

})
