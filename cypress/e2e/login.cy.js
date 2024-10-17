describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login'); // Ensure the correct URL is visited
    });
  
    it('should display login form', () => {
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button').contains('Login').should('be.visible');
    });
  
    it('should not allow login with empty fields', () => {
      cy.get('button').contains('Login').click();
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Login failed'); // Adjust based on the alert message
      });
    });
  
    it('should log in with valid credentials', () => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('password123');
      cy.get('button').contains('Login').click();
    });
  });
  