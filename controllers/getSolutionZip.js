const buildLinkList = require('./buildLinkList');
const getSolution = require('./getSolution');
const writeFile = require('./writeFile');

module.exports = async (camper, res) => {
    buildLinkList(camper)
        .then((links) => {
            const count = links.length;
            links.forEach((link) => {
                writeFile(getSolution(link), count, camper);
            });
            return zipFileName;
            // for (let link of links) {
            //     writeFile(getSolution(link), count, camper);
            // }
        });
};