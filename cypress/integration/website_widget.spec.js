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
    websiteWidget.closePrompt();
    cy.get('#podium-prompt').should('not.exist');
  });

  it('should toggle the modal open and close', () => {
    websiteWidget.toggle();
    cy.getIframeBody('#podium-bubble').find('button').invoke('attr', 'aria-label').should('include', 'close');
    websiteWidget.toggle();
    cy.getIframeBody('#podium-bubble').find('button').invoke('attr', 'aria-label').should('include', 'open');
  });

  it('should toggle the modal open and click outside of the modal to close', () => {
    websiteWidget.toggle();
    cy.get('#podium-modal').should('exist');
    cy.getIframeBody('#podium-modal').click(0, 0);
    cy.get('#podium-modal').should('not.exist');
  });

  // The following test is skipped due to a known bug.
  it.skip('should search the modal by postal code or address and return locations', () => {
    websiteWidget.toggle();
    cy.getIframeBody('#podium-modal').find('.LocationSelector').within(() => {
      cy.get('.LocationItemsContainer').children().then(($initialList) => {
        const initialList = $initialList.text();
        cy.get('.SearchInput').within(() => {
          cy.get('input[name="Search Locations"]').invoke('val').should('not.be.empty');
          cy.get('.SearchInput__Reset').click();
          cy.get('input[name="Search Locations"]').invoke('val').should('be.empty');
          cy.get('input[name="Search Locations"]').type('97206{enter}');
        });
        cy.get('.LocationItemsContainer').children().then(($updatedList) => {
          const updatedList = $updatedList.text();
          expect(updatedList).not.to.equal(initialList);
        });
      });

    });
  });

  // The following test is skipped due to a known bug.
  it.skip('should go back to Select Location when the back arrow is clicked', () => {
    websiteWidget.toggle();
    websiteWidget.clickOrem();
    cy.getIframeBody('#podium-modal').find('.SendSmsPage__ArrowIcon').click();
    cy.getIframeBody('#podium-modal').find('.LocationSelector').should('be.visible');
  });

  it('should complete the core user flow of the website widget', () => {
    // Open iframe
    websiteWidget.toggle();
    cy.getIframeBody('#podium-modal').find('.LocationSelector').should('be.visible');
    // Click 'Scoreboard Sports - Orem'
    websiteWidget.clickOrem();
    // Input Name, Mobile Phone, and Message, and submit form
    websiteWidget.submitForm('Courtney Schild', '5038669998', 'This is a test.');
    // Check for confirmation
    cy.getIframeBody('#podium-modal').find('.SendSmsPage__MainContent').within(($form) => {
      cy.get('.SendSmsPage__FormContent').should('not.exist');
      cy.get('.SubmittedMessage--visible').should('exist').and('be.visible');
      cy.get('.SubmittedMessage__SendStatus').should('have.text', 'Sending...').and('be.visible');
      cy.get('.SubmittedMessage__SendStatus').should('have.text', 'Received').and('be.visible');
      cy.get('.ConfirmationMessage').should('be.visible');
    });
  });

  it('should navigate to Podium Acceptable Use Policy', () => {
    websiteWidget.toggle();
    cy.getIframeBody('#podium-modal').find('.LocationSelector__PodiumPower').within(() => {
      // target="_blank" will open link in a new tab
      cy.contains('a', 'use is subject to terms').then(($link) => {
        expect($link).to.have.attr('href', 'https://www.podium.com/acceptable-use-policy/');
        cy.request($link.prop('href')).its('status').should('eq', 200);
      })
    });
  });

  it('should return errors within the form when inputs are empty', () => {
    const errors = [
      { index: 0, text: 'Name is required' },
      { index: 1, text: 'Mobile phone is required' },
      { index: 2, text: 'Message is required' }
    ];
    websiteWidget.toggle();
    websiteWidget.clickOrem();
    cy.getIframeBody('#podium-modal').find('.SendSmsPage__MainContent').within(($form) => {
      cy.wrap($form).submit();
      errors.forEach((error) => {
        cy.get('.TextInput__TextInputError').eq(error.index).should('have.text', error.text);
      });
    });
  });

  it('should return an error when Mobile Phone* is too short', () => {
    websiteWidget.toggle();
    websiteWidget.clickOrem();
    websiteWidget.submitForm('Courtney Schild', '503', 'This is a test.');
    cy.getIframeBody('#podium-modal').find('.SendSmsPage__MainContent').within(() => {
      cy.get('.TextInput__TextInputError--tel').should('have.text', 'Mobile phone is too short');
    });
  });

  it('should return an error when Mobile Phone* is invalid', () => {
    websiteWidget.toggle();
    websiteWidget.clickOrem();
    websiteWidget.submitForm('Courtney Schild', '0000000000', 'This is a test.');
    // Check for errors
    cy.getIframeBody('#podium-modal').find('.SendSmsPage__MainContent').within(() => {
      cy.get('.SendSmsPage__FormContent').should('not.exist');
      cy.get('.SubmittedMessage--visible').should('exist').and('be.visible');
      cy.get('.SubmittedMessage__SendStatus').should('have.text', 'Sending...').and('be.visible');
      cy.get('.ConfirmationMessage').should('not.exist');
      cy.get('.Legal--error').should('have.text', 'Please enter a phone number that can receive texts.');
      cy.get('button[type=submit]').should('have.text', 'Try Again');
    });
  });

})