/**
 * Scraper module. Exports functions for various uses.
 * @module scraper
 */

const Xray = require('x-ray');
const x = Xray();

module.exports = {

  /**
   * @requires NPM:x-ray
   * @param {string} username Target freeCodeCamp username for scraping
   * @returns {promise} List of urls containing a solution query string
   */
  buildLinkList(username) {
      return new Promise((resolve, reject) => {
          let linkList = [];
          x(`https://freecodecamp.org/${username}`, ['a@href'])((err, data) => {
              let links = data.toString().split(',');
              for (let link of links) {
                  if (link.match(/\?solution=/)) {
                      linkList.push(link);
                  }
              }
              const linkListDeDuped = Array.from(new Set(linkList));
              resolve(linkListDeDuped);
          });
      });
  },

};
