export default class WebsiteWidget {

  constructor() {}

  toggle() {
    return cy
      .getIframeBody('#podium-bubble')
      .find('button')
      .click()
  }

  clickOrem() {
    cy.getIframeBody('#podium-modal').find('.LocationsList').within(() => {
      cy.get('button').first().click();
    });
  }

  fillForm(name, mobilePhone, message) {
    cy.get('#Name').clear().type(name);
    cy.get('input[type=tel]').clear().type(mobilePhone);
    cy.get('#Message').clear().type(message);
  }

  submitForm(name, mobilePhone, message) {
    cy.getIframeBody('#podium-modal').find('.SendSmsPage__MainContent').within(($form) => {
      cy.get('.SendSmsPage__TextInvitation').should('exist').and('not.be.visible');
      this.fillForm(name, mobilePhone, message)
      cy.wrap($form).submit();
    });
  }

  closePrompt() {
    cy.getIframeBody('#podium-prompt').find('button').should('have.text', 'close').click();
  }
  
}