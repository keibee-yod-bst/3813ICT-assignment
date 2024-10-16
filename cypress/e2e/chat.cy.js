describe('Chat Page', () => {
    beforeEach(() => {
      cy.visit('/channels/1'); // Ensure a valid channel route is used
    });
  
    it('should load chat messages', () => {
      cy.get('.chat-message').should('exist');
    });
  
    it('should send a text message', () => {
      cy.get('input[placeholder="Type your message..."]').type('Hello, world!');
      cy.get('button').contains('Send').click();
      cy.get('.chat-message').contains('Hello, world!').should('exist');
    });
  
    it('should upload an image', () => {
      cy.get('input[type="file"]').attachFile('test-image.jpg'); // Requires a test image in the fixtures folder
      cy.get('.chat-image').should('exist');
    });
  });
  