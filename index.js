const fs = require('fs');
const stat = fs.statSync;
const path = require('path');
const Xray = require('x-ray');
const parse = require('url-parse');
const x = Xray();
const AdmZip = require('adm-zip');

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
 * @returns null
 */
const writeFile = (fileObject, count) => {
    const challenge = fileObject.challenge.replace(/%20/g, '-');
    const solution = fileObject.solution;
    const dir = './solutions';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`./solutions/${challenge}.js`, solution);
    const dirArray = fs.readdirSync(dir);
    
    if (dirArray.length === count) {
        newArchive(`jacksonbates-archive-${+new Date}.zip`, dirArray);
    }
}

const newArchive = (zipFileName, pathNames) => {
    const zip = new AdmZip();
    
    pathNames.forEach(target => {
    target = path.join('./solutions', target);
    const p = stat(target);
        if (p.isFile()) {
            zip.addLocalFile(target);
        } else if (p.isDirectory()) {
            zip.addLocalFolder(target, target);
        }
    });

    zip.writeZip(zipFileName);
}

const writeSolutions = () => {
    buildLinkList('jacksonbates')
        .then((links) => {
            const count = links.length;
            console.log('number of links', count);
            for (let link of links) {
                // console.log(link);
                writeFile(getSolution(link), count);
            }
        });
    }

writeSolutions();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 
// Successful demos
//
// This successfully creates a solution.js file in a solutions dir, based on the return value of getSolution()
// writeFile(getSolution('https://www.freecodecamp.org/challenges/Smallest%20Common%20Multiple?solution=function%20smallestCommons(arr)%20%7B%0A%0A%20%20function%20isPrime(candidate)%20%7B%0A%20%20%20%20var%20divisor%20%3D%203%3B%0A%20%20%20%20while%20(divisor%20%3C%20candidate)%20%7B%0A%20%20%20%20%20%20if%20(candidate%20%25%20divisor%20%3D%3D%3D%200%20%7C%7C%20candidate%20%25%202%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20%20%20%20%20return%20false%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20divisor%20%2B%3D%202%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20return%20true%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20Put%20the%20numbers%20from%20largest%20to%20smallest%0A%20%20if%20(arr%5B0%5D%20%3C%20arr%5B1%5D)%20%7B%0A%20%20%20%20arr.sort(function(a%2C%20b)%20%7B%0A%20%20%20%20return%20a%20%2B%20b%3B%20%2F%2F%20%3D%20%5B5%2C1%5D%0A%20%20%7D)%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20create%20an%20array%20to%20fill%20in%20the%20missing%20numbers%0A%20%20var%20expArr%20%3D%20%5B%5D%3B%20%0A%0A%20%20%2F%2FFill%20in%20the%20missing%20numbers%0A%20%20for%20(var%20i%20%3D%20arr%5B0%5D%3B%20i%20%3E%3D%20arr%5B1%5D%3B%20i--)%20%7B%0A%20%20%20%20expArr.push(i)%3B%0A%20%20%7D%0A%20%20var%20primes%20%3D%20%5B2%2C%203%2C%205%2C%207%2C%2011%2C%2013%2C%2017%2C%2019%5D%3B%20%2F%2F%20Hardcoded%20primes%20--%20whatchagonnadoboutit%3F%20%0A%20%20var%20primeFacs%20%3D%20%5B%5D%3B%0A%0A%20%20%2F%2F%20INSERT%20MAGIC%0A%0A%20%20%2F%2F%20Determine%20primeFacs%20and%20push%20them%20to%20the%20array%0A%20%20%2F%2F%20for%20each%20number%20in%20expArr%20%3D%20n%2C%0A%0A%20%20for%20(var%20arrIndex%20%3D%200%3B%20arrIndex%20%3C%20expArr.length%3B%20arrIndex%2B%2B)%20%7B%0A%20%20%20%20%2F%2F%20check%20if%20n%20isPrime%20-%3E%20yes%2C%20return%20n%20as%20prime%20Fac%0A%20%20%20%20var%20n%20%3D%20expArr%5BarrIndex%5D%3B%0A%20%20%20%20var%20tempArr%20%3D%20%5B%5D%3B%0A%20%20%20%20while%20(n%20%3E%201)%20%7B%0A%20%20%20%20%20%20if%20(isPrime(n))%20%7B%0A%20%20%20%20%20%20%20%20tempArr.push(n)%3B%0A%20%20%20%20%20%20%20%20n%20%3D%200%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20var%20primesIndex%20%3D%200%3B%0A%20%20%20%20%20%20%20%20while%20(primesIndex%20%3C%20primes.length)%20%7B%0A%20%20%20%20%20%20%20%20%20%20if%20(n%20%25%20primes%5BprimesIndex%5D%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20put%20primes%5Bk%5D%20in%20temp%0A%20%20%20%20%20%20%20%20%20%20%20%20tempArr.push(primes%5BprimesIndex%5D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20n%20%3D%20n%20%2F%20primes%5BprimesIndex%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20primesIndex%2B%2B%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20primeFacs.push(tempArr)%3B%20%2F%2F%20don%27t%20touch%20anything%2C%20it%20works.%20After%20several%20days%2C%20it%20works.%20%0A%20%20%7D%0A%20%20primeFacs.pop()%3B%20%2F%2F%20clears%20the%20blank%20array%20representing%201%0A%0A%20%20%2F%2F%20create%20an%20array%20of%20objects%20counting%20the%20%0A%20%20%2F%2F%20number%20of%20repeated%20elements%20in%20each%20of%20the%20primeFacs%20arrays%0A%0A%20%20var%20countsArr%20%3D%20%5B%5D%3B%0A%0A%20%20for%20(var%20pfidx%20%3D%200%3B%20pfidx%20%3C%20primeFacs.length%3B%20pfidx%2B%2B)%20%7B%0A%20%20%20%20var%20counts%20%3D%20%7B%7D%3B%0A%20%20%20%20for%20(var%20pfs%20%3D%200%3B%20pfs%20%3C%20primeFacs%5Bpfidx%5D.length%3B%20pfs%2B%2B)%20%7B%0A%20%20%20%20%20%20var%20num%20%3D%20primeFacs%5Bpfidx%5D%5Bpfs%5D%3B%0A%20%20%20%20%20%20if%20(counts%5Bnum%5D)%20%7B%0A%20%20%20%20%20%20%20%20counts%5Bnum%5D%2B%2B%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20counts%5Bnum%5D%20%3D%201%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20countsArr.push(counts)%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20make%20an%20array%20that%20contains%20only%20the%20individual%20primes%20and%20the%20highest%20count%0A%20%20%0A%20%20var%20finalCounts%20%3D%20%5B%5D%3B%0A%0A%20%20for%20(var%20obj%20%3D%200%3B%20obj%20%3C%20countsArr.length%3B%20obj%2B%2B)%20%7B%0A%20%20%20%20for%20(var%20key%20%3D%200%3B%20key%20%3C%20Object.keys(countsArr%5Bobj%5D).length%3B%20key%2B%2B)%20%7B%0A%20%20%20%20%20%20var%20number%20%3D%20Object.keys(countsArr%5Bobj%5D)%5Bkey%5D%3B%0A%20%20%20%20%20%20if%20(!finalCounts.includes(number))%20%7B%0A%20%20%20%20%20%20%20%20finalCounts.push(number%2C%20countsArr%5Bobj%5D%5Bnumber%5D)%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(finalCounts.includes(number))%20%7B%0A%20%20%20%20%20%20%20%20var%20current%20%3D%20finalCounts.indexOf(number)%20%2B%201%3B%0A%20%20%20%20%20%20%20%20var%20potential%20%3D%20countsArr%5Bobj%5D%5Bnumber%5D%3B%0A%20%20%20%20%20%20%20%20if%20(finalCounts%5Bcurrent%5D%20%3C%20potential)%20%7B%0A%20%20%20%20%20%20%20%20%20%20finalCounts%5Bcurrent%5D%20%3D%20potential%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20%0A%20%20%2F%2F%20create%20an%20array%20that%20has%20all%20the%20PrimeFacs%20occuring%20as%20frequently%0A%20%20%2F%2F%20as%20needed%2C%20rather%20than%20adjacent%20to%20their%20%27count%27%0A%20%20%0A%20%20var%20expandedPrimeFacs%20%3D%20%5B%5D%3B%0A%20%20%0A%20%20for%20(var%20fCIdx%20%3D%200%3B%20fCIdx%20%3C%20finalCounts.length%3B%20fCIdx%20%2B%3D%202)%20%7B%0A%20%20%20%20for%20(var%20multiply%20%3D%200%3B%20multiply%20%3C%20finalCounts%5BfCIdx%20%2B%201%5D%3B%20multiply%2B%2B)%20%7B%0A%20%20%20%20%20%20expandedPrimeFacs.push(parseInt(finalCounts%5BfCIdx%5D))%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20%2F%2F%20return%20that%2C%20using%20reduce%20to%20multiply%20them%20all%20together%0A%20%20return%20expandedPrimeFacs.reduce(function(a%2Cb)%20%7Breturn%20a%20*%20b%3B%7D)%3B%0A%0A%7D%0A%0AsmallestCommons(%5B1%2C25%5D)%3B'));
//
// This successfully logs the parsed / formatted solution from the query string provided by FCC solutions
// console.log(getSolution('https://www.freecodecamp.org/challenges/Smallest%20Common%20Multiple?solution=function%20smallestCommons(arr)%20%7B%0A%0A%20%20function%20isPrime(candidate)%20%7B%0A%20%20%20%20var%20divisor%20%3D%203%3B%0A%20%20%20%20while%20(divisor%20%3C%20candidate)%20%7B%0A%20%20%20%20%20%20if%20(candidate%20%25%20divisor%20%3D%3D%3D%200%20%7C%7C%20candidate%20%25%202%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20%20%20%20%20return%20false%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20divisor%20%2B%3D%202%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20return%20true%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20Put%20the%20numbers%20from%20largest%20to%20smallest%0A%20%20if%20(arr%5B0%5D%20%3C%20arr%5B1%5D)%20%7B%0A%20%20%20%20arr.sort(function(a%2C%20b)%20%7B%0A%20%20%20%20return%20a%20%2B%20b%3B%20%2F%2F%20%3D%20%5B5%2C1%5D%0A%20%20%7D)%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20create%20an%20array%20to%20fill%20in%20the%20missing%20numbers%0A%20%20var%20expArr%20%3D%20%5B%5D%3B%20%0A%0A%20%20%2F%2FFill%20in%20the%20missing%20numbers%0A%20%20for%20(var%20i%20%3D%20arr%5B0%5D%3B%20i%20%3E%3D%20arr%5B1%5D%3B%20i--)%20%7B%0A%20%20%20%20expArr.push(i)%3B%0A%20%20%7D%0A%20%20var%20primes%20%3D%20%5B2%2C%203%2C%205%2C%207%2C%2011%2C%2013%2C%2017%2C%2019%5D%3B%20%2F%2F%20Hardcoded%20primes%20--%20whatchagonnadoboutit%3F%20%0A%20%20var%20primeFacs%20%3D%20%5B%5D%3B%0A%0A%20%20%2F%2F%20INSERT%20MAGIC%0A%0A%20%20%2F%2F%20Determine%20primeFacs%20and%20push%20them%20to%20the%20array%0A%20%20%2F%2F%20for%20each%20number%20in%20expArr%20%3D%20n%2C%0A%0A%20%20for%20(var%20arrIndex%20%3D%200%3B%20arrIndex%20%3C%20expArr.length%3B%20arrIndex%2B%2B)%20%7B%0A%20%20%20%20%2F%2F%20check%20if%20n%20isPrime%20-%3E%20yes%2C%20return%20n%20as%20prime%20Fac%0A%20%20%20%20var%20n%20%3D%20expArr%5BarrIndex%5D%3B%0A%20%20%20%20var%20tempArr%20%3D%20%5B%5D%3B%0A%20%20%20%20while%20(n%20%3E%201)%20%7B%0A%20%20%20%20%20%20if%20(isPrime(n))%20%7B%0A%20%20%20%20%20%20%20%20tempArr.push(n)%3B%0A%20%20%20%20%20%20%20%20n%20%3D%200%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20var%20primesIndex%20%3D%200%3B%0A%20%20%20%20%20%20%20%20while%20(primesIndex%20%3C%20primes.length)%20%7B%0A%20%20%20%20%20%20%20%20%20%20if%20(n%20%25%20primes%5BprimesIndex%5D%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20put%20primes%5Bk%5D%20in%20temp%0A%20%20%20%20%20%20%20%20%20%20%20%20tempArr.push(primes%5BprimesIndex%5D)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20n%20%3D%20n%20%2F%20primes%5BprimesIndex%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20primesIndex%2B%2B%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20primeFacs.push(tempArr)%3B%20%2F%2F%20don%27t%20touch%20anything%2C%20it%20works.%20After%20several%20days%2C%20it%20works.%20%0A%20%20%7D%0A%20%20primeFacs.pop()%3B%20%2F%2F%20clears%20the%20blank%20array%20representing%201%0A%0A%20%20%2F%2F%20create%20an%20array%20of%20objects%20counting%20the%20%0A%20%20%2F%2F%20number%20of%20repeated%20elements%20in%20each%20of%20the%20primeFacs%20arrays%0A%0A%20%20var%20countsArr%20%3D%20%5B%5D%3B%0A%0A%20%20for%20(var%20pfidx%20%3D%200%3B%20pfidx%20%3C%20primeFacs.length%3B%20pfidx%2B%2B)%20%7B%0A%20%20%20%20var%20counts%20%3D%20%7B%7D%3B%0A%20%20%20%20for%20(var%20pfs%20%3D%200%3B%20pfs%20%3C%20primeFacs%5Bpfidx%5D.length%3B%20pfs%2B%2B)%20%7B%0A%20%20%20%20%20%20var%20num%20%3D%20primeFacs%5Bpfidx%5D%5Bpfs%5D%3B%0A%20%20%20%20%20%20if%20(counts%5Bnum%5D)%20%7B%0A%20%20%20%20%20%20%20%20counts%5Bnum%5D%2B%2B%3B%0A%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20counts%5Bnum%5D%20%3D%201%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20countsArr.push(counts)%3B%0A%20%20%7D%0A%0A%20%20%2F%2F%20make%20an%20array%20that%20contains%20only%20the%20individual%20primes%20and%20the%20highest%20count%0A%20%20%0A%20%20var%20finalCounts%20%3D%20%5B%5D%3B%0A%0A%20%20for%20(var%20obj%20%3D%200%3B%20obj%20%3C%20countsArr.length%3B%20obj%2B%2B)%20%7B%0A%20%20%20%20for%20(var%20key%20%3D%200%3B%20key%20%3C%20Object.keys(countsArr%5Bobj%5D).length%3B%20key%2B%2B)%20%7B%0A%20%20%20%20%20%20var%20number%20%3D%20Object.keys(countsArr%5Bobj%5D)%5Bkey%5D%3B%0A%20%20%20%20%20%20if%20(!finalCounts.includes(number))%20%7B%0A%20%20%20%20%20%20%20%20finalCounts.push(number%2C%20countsArr%5Bobj%5D%5Bnumber%5D)%3B%0A%20%20%20%20%20%20%7D%20else%20if%20(finalCounts.includes(number))%20%7B%0A%20%20%20%20%20%20%20%20var%20current%20%3D%20finalCounts.indexOf(number)%20%2B%201%3B%0A%20%20%20%20%20%20%20%20var%20potential%20%3D%20countsArr%5Bobj%5D%5Bnumber%5D%3B%0A%20%20%20%20%20%20%20%20if%20(finalCounts%5Bcurrent%5D%20%3C%20potential)%20%7B%0A%20%20%20%20%20%20%20%20%20%20finalCounts%5Bcurrent%5D%20%3D%20potential%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20%0A%20%20%2F%2F%20create%20an%20array%20that%20has%20all%20the%20PrimeFacs%20occuring%20as%20frequently%0A%20%20%2F%2F%20as%20needed%2C%20rather%20than%20adjacent%20to%20their%20%27count%27%0A%20%20%0A%20%20var%20expandedPrimeFacs%20%3D%20%5B%5D%3B%0A%20%20%0A%20%20for%20(var%20fCIdx%20%3D%200%3B%20fCIdx%20%3C%20finalCounts.length%3B%20fCIdx%20%2B%3D%202)%20%7B%0A%20%20%20%20for%20(var%20multiply%20%3D%200%3B%20multiply%20%3C%20finalCounts%5BfCIdx%20%2B%201%5D%3B%20multiply%2B%2B)%20%7B%0A%20%20%20%20%20%20expandedPrimeFacs.push(parseInt(finalCounts%5BfCIdx%5D))%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%0A%20%20%2F%2F%20return%20that%2C%20using%20reduce%20to%20multiply%20them%20all%20together%0A%20%20return%20expandedPrimeFacs.reduce(function(a%2Cb)%20%7Breturn%20a%20*%20b%3B%7D)%3B%0A%0A%7D%0A%0AsmallestCommons(%5B1%2C25%5D)%3B'));
//
//