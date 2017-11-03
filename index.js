const readline = require('readline');
const clear = require('clear');
const scraper = require('./scraper');
const printLogo = require('./printLogo');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const writeSolutions = async (camper) => {
    let links = await scraper.buildLinkList(camper);
    const count = links.length;
    for (let link of links) {
        scraper.writeFile(scraper.getSolution(link), count, camper);
    }
}

clear();
rl.question('Please enter the username to scrape: ', async (camper) => {
    console.log('Scraping in progress...');
    await writeSolutions(camper);
    printLogo();
    rl.close();
});
