const readline = require('readline');
const fs = require('fs');
const stat = fs.statSync;
const path = require('path');
const clear = require('clear');
const yazl = require('yazl');
const rimraf = require('rimraf');
const isHtml = require('is-html');

const scraper = require('./scraper');


/**
 * Writes solution files to a solutions folder
 * @requires 'fs'
 * @requires NPM:isHtml
 * @param {object} fileObject Object must contain valid 'challenge' and 'solution' keys
 * @param {int} count Number of files to be zipped
 * @param {string} camper The username of the camper to be scraped - taken from rl.question at the bottom of the file
 * @returns undefined
 */
const writeFile = (fileObject, count, camper) => {
    const challenge = fileObject.challenge.replace(/%20/g, '-');
    const solution = fileObject.solution;
    const dir = './solutions';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`./solutions/${challenge}${isHtml(solution) ? '.html' : '.js'}`, solution);
    const dirArray = fs.readdirSync(dir);
    if (dirArray.length === count) {
        newArchive(`${camper}-archive-${+new Date}.zip`, dirArray);
    }
}

/**
 * Creates a zip file based on the contents of the solutions folder
 * @requires 'fs'
 * @requires NPM:yazl
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
        console.log(`
        I zipped it real good!

        You can collect your zipped archive from the fcc-scraper directory.

        *If you found this useful, star the JacksonBates/fcc-scraper repo on GitHub*
        Twitter, Instagram and FCC forum: @jacksonbates
        `);
        rimraf.sync('./solutions');
      });
    zipfile.end();
}

const writeSolutions = (camper) => {
    scraper.buildLinkList(camper)
        .then((links) => {
            const count = links.length;
            for (let link of links) {
                writeFile(scraper.getSolution(link), count, camper);
            }
        });
    }

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
clear();
rl.question('Please enter the username to scrape: ', (camper) => {
    writeSolutions(camper);
    console.log(`
        ***          **             ***
       **            ***              **
      **             ****              **
     **              ****  **           **
    **              *****  **           ***
    **              **********           **
    **             ***** *****           **
    **            *****  *****           ***
    **            ****   *****           ***
    **            ***       *            **
    **             **      **            **
    ***             *                    **
     **              *                  **
      **                               **
       **        ***************      **
        ***                         ***
          *                         *
    `);
    rl.close();
});
