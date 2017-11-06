const fs = require('fs');
const isHtml = require('is-html');

const newArchive = require('./newArchive');

module.exports = (fileObject, count, camper) => {
    const challenge = fileObject.challenge.replace(/%20/g, '-');
    const solution = fileObject.solution;
    const dir = `./solutions-${camper}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${challenge}${isHtml(solution) ? '.html' : '.js'}`, solution);
    const dirArray = fs.readdirSync(dir);
    if (dirArray.length === count) {
        newArchive(`${camper}.zip`, dirArray, camper);
    }
}