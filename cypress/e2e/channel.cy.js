describe('Channel Page', () => {
    beforeEach(() => {
      cy.visit('/channels');
    });
  
    it('should display a list of channels', () => {
      cy.get('ul').find('li').should('have.length.greaterThan', 0);
    });
  
    it('should navigate to a channel on click', () => {
      cy.get('a').contains('General').click();
      cy.url().should('include', '/channels/1');
    });
  });
  