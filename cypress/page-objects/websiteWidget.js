export default class WebsiteWidget {

  constructor() {}

  toggleBubble() {
    return cy
      .getIframeBody('#podium-bubble')
      .find('button')
      .click()
  }
  
}