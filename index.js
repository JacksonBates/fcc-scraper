const readline = require('readline');
const fs = require('fs');
const stat = fs.statSync;
const path = require('path');
const Xray = require('x-ray');
const parse = require('url-parse');
const x = Xray();
const yazl = require('yazl');
const rimraf = require('rimraf');

/**
 * @requires NPM:x-ray
 * @param {string} username Target freeCodeCamp username for scraping
 * @returns {promise} List of urls containing a solution query string
 */
const buildLinkList = (username) => {
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
    })
};


/**
 * @requires NPM:url-parse
 * @param {string} url
 * @returns {object} Object containing the name of the challenge and the solution from freeCodeCamp challenge solution links
 */
const getSolution = (url) => {
    const data = parse(url, true);
    const challenge = data.pathname.replace(/\/challenges\//, '');
    const solution = data.query.solution;
    return {
        challenge,
        solution
    };
}

/**
 * Writes solution files to a solutions folder
 * @requires 'fs'
 * @param {object} fileObject Object must contain valid 'challenge' and 'solution' keys
 * @param {int} count Number of files to be zipped
 * @returns undefined
 */
const writeFile = (fileObject, count, camper) => {
    const challenge = fileObject.challenge.replace(/%20/g, '-');
    const solution = fileObject.solution;
    const dir = './solutions';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`./solutions/${challenge}.js`, solution);
    const dirArray = fs.readdirSync(dir);
    if (dirArray.length === count) {
        newArchive(`${camper}-archive-${+new Date}.zip`, dirArray);
    }
}

/**
 * Creates a zip file based on the contents of the solutions folder
 * @param {string} zipFileName The name of the output zipfile 
 * @param {array} pathNames An array of all filenames to be zipped
 */
const newArchive = (zipFileName, pathNames) => {
    const zipfile = new yazl.ZipFile();
    
    pathNames.forEach(target => {
        const joinedTarget = path.join('./solutions/', target);
        const p = stat(joinedTarget);
            if (p.isFile()) {
                zipfile.addFile(joinedTarget, joinedTarget);
            }
    });
    zipfile.outputStream.pipe(fs.createWriteStream(zipFileName)).on("close", () => {
        console.log('zipped it real good!/nYou can collect your zipped archive from the fcc-scrape directory');
        rimraf.sync('./solutions');
      });
    zipfile.end();
}

const writeSolutions = (camper) => {
    buildLinkList(camper)
        .then((links) => {
            const count = links.length;
            for (let link of links) {
                writeFile(getSolution(link), count, camper);
            }
        });
    }

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });
rl.question('Please enter the username to scrape: ', (camper) => {
    writeSolutions(camper);
    rl.close();
});
