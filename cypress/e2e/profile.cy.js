describe('Profile Page', () => {
    beforeEach(() => {
      cy.visit('/profile');
    });
  
    it('should display user profile information', () => {
      cy.get('h2').contains('Your Profile').should('be.visible');
      cy.get('input[name="username"]').should('have.value', 'testuser');
    });
  
    it('should update profile image', () => {
      cy.get('input[type="file"]').attachFile('profile-pic.jpg');
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Profile image updated');
      });
    });
  });
  