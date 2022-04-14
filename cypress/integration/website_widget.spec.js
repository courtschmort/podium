import WebsiteWidget from '../page-objects/websiteWidget';

describe('Website Widget', () => {

  const websiteWidget = new WebsiteWidget();

  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should visit the baseUrl', () => {
    cy.url().should('eq', Cypress.config().baseUrl)
  });

  it('should check for h1 and iframes', () => {
    cy.contains('h1', 'All we have to decide is what to do with the time that is given us.');
    cy.get('#podium-prompt').should('be.visible');
    cy.get('#podium-bubble').should('be.visible');
  });
  
  it('should close the prompt', () => {
    cy.get('#podium-prompt').should('exist');
    cy.getIframeBody('#podium-prompt').find('button').should('have.text', 'close').click();
    cy.get('#podium-prompt').should('not.exist');
  });

  it('should open and close the modal by toggling the bubble', () => {
    websiteWidget.toggleBubble();
    cy.getIframeBody('#podium-bubble').find('button').invoke('attr', 'aria-label').should('include', 'close');
    websiteWidget.toggleBubble();
    cy.getIframeBody('#podium-bubble').find('button').invoke('attr', 'aria-label').should('include', 'open');
  });

  it('should open and close the modal by toggling the bubble and clicking outside of the modal', () => {
    websiteWidget.toggleBubble();
    cy.get('#podium-modal').should('exist');
    cy.getIframeBody('#podium-modal').click(0, 0);
    cy.get('#podium-modal').should('not.exist');
  });
  
})