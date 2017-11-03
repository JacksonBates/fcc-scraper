const readline = require('readline');
const clear = require('clear');

const scraper = require('./scraper');
const printLogo = require('./printLogo');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const writeSolutions = (camper) => {
    scraper.buildLinkList(camper)
        .then((links) => {
            const count = links.length;
            for (let link of links) {
                scraper.writeFile(scraper.getSolution(link), count, camper);
            }
        });
    }

clear();
rl.question('Please enter the username to scrape: ', (camper) => {
    writeSolutions(camper);

    printLogo();
    rl.close();
});
