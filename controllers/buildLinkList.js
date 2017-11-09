const Xray = require('x-ray');
const x = Xray();

module.exports = (camper) => {
  return new Promise((resolve, reject) => {
    let linkList = [];
    x(`https://freecodecamp.org/${camper}`, ['a@href'])((err, data) => {
      if (err) console.log('Error in buildLinkList', err);
      let links = data.toString().split(',');
      for (let link of links) {
          if (link.match(/\?solution=/)) {
              linkList.push(link);
          } 
      }
      const linkListDeDuped = Array.from(new Set(linkList));
      (linkListDeDuped.length > 0) ? resolve(linkListDeDuped) : reject('Camper not found');
    });
  })
}