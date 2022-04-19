export default class WebsiteWidget {

  constructor() {}

  toggle() {
    return cy
      .getIframeBody('#podium-bubble')
      .find('button')
      .click()
  }
  
}