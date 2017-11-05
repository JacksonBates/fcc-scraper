const fs = require('fs');
const isHtml = require('is-html');

const newArchive = require('./newArchive');

module.exports = (fileObject, count, camper) => {
    const challenge = fileObject.challenge.replace(/%20/g, '-');
    const solution = fileObject.solution;
    const dir = './solutions'; //TODO:unique dir to avoid clashes
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`./solutions/${challenge}${isHtml(solution) ? '.html' : '.js'}`, solution);
    const dirArray = fs.readdirSync(dir);
    if (dirArray.length === count) {
        newArchive(`${camper}.zip`, dirArray);
    }
}