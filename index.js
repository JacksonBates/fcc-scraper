const readline = require('readline');
const clear = require('clear');

const scraper = require('./scraper');

const writeSolutions = (camper) => {
    scraper.buildLinkList(camper)
        .then((links) => {
            const count = links.length;
            for (let link of links) {
                scraper.writeFile(scraper.getSolution(link), count, camper);
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
