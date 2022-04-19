# [QA Take-Home Assignment](/assets/QA__Take-Home_Assignment.pdf)

Interview for Software Development Engineer - Test at [Podium](https://www.podium.com/)

By Courtney Schild

## Description

This repository contains an executable automated test suite covering core user flows for https://demo.podium.tools/qa-webchat-lorw/, Podium's webchat widget product, using [Cypress](https://www.cypress.io/) and JavaScript.

## Installation

1. Clone [podium](https://github.com/courtschmort/podium)
2. Run `npm install`

## Usage

### Headed

1. Run `npm run cypress:open`
2. Click `website_widget.spec.js`

## Known Bugs

A few tests within `website_widget.spec.js` have been skipped due to known bugs, which are outlined below.

- The search bar returns the same locations regardless of the postal code or address inputted.
- There is a `Script error` within the iframe header container, as indicated within the screenshot below.
  ![Script error](/assets/bug.png)

Other known bugs include:

- The iframe prompt doesn't display consistently.
- Remove the space in `#Mobile Phone`.
- The iframe Send button isn't actually disabled.

## Roadmap

- Use `data-testid`s
- [Mailosaur](https://mailosaur.com/) for SMS testing
- [Visual Testing](https://docs.cypress.io/guides/tooling/visual-testing)
- Accessibility Testing
