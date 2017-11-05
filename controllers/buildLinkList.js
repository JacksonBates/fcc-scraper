const Xray = require('x-ray');
const x = Xray();

module.exports = (camper) => {
  return new Promise((resolve, reject) => {
    let linkList = [];
    x(`https://freecodecamp.org/${camper}`, ['a@href'])((err, data) => {
        let links = data.toString().split(',');
        for (let link of links) {
            if (link.match(/\?solution=/)) {
                linkList.push(link);
            } 
        }
        const linkListDeDuped = Array.from(new Set(linkList));
        resolve(linkListDeDuped);
    });
})
}