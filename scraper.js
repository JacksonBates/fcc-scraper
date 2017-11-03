/**
 * Scraper module. Exports functions for various uses.
 * @module scraper
 */

const Xray = require('x-ray');
const x = Xray();
const parse = require('url-parse');

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

  /**
   * Parses the URLs from the hrefs to obtain the challenge name and solution
   * @requires NPM:url-parse
   * @param {string} url The unparsed URL string scrpaed from freeCodeCamp profile
   * @returns {object} Object containing the name of the challenge and the solution from freeCodeCamp challenge solution links
   */
  getSolution(url) {
      const data = parse(url, true);
      const challenge = data.pathname.replace(/\/challenges\//, '');
      const solution = data.query.solution.replace(/fccss/, '<script>').replace(/fcces/, '</script>');
      return {
          challenge,
          solution
      };
  },

};
