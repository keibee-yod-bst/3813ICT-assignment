describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('/register');
    });
  
    it('should display register form', () => {
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button').contains('Register').should('be.visible');
    });
  
    it('should disable the register button if fields are empty', () => {
      cy.get('button').contains('Register').should('be.disabled');
    });
  
    it('should register a new user', () => {
      cy.get('input[name="username"]').type('newuser');
      cy.get('input[name="password"]').type('password123');
      cy.get('button').contains('Register').click();
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Registration successful!');
      });
      cy.url().should('include', '/login');
    });
  });
  