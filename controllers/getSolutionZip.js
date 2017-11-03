const readline = require('readline');
const fs = require('fs');
const stat = fs.statSync;
const path = require('path');
const clear = require('clear');
const Xray = require('x-ray');
const parse = require('url-parse');
const x = Xray();
const yazl = require('yazl');
const rimraf = require('rimraf');
const isHtml = require('is-html');


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

const getSolution = (url) => {
  const data = parse(url, true);
  const challenge = data.pathname.replace(/\/challenges\//, '');
  const solution = data.query.solution.replace(/fccss/, '<script>').replace(/fcces/, '</script>');
  return {
      challenge,
      solution
  };
}

const writeFile = (fileObject, count, camper) => {
    const challenge = fileObject.challenge.replace(/%20/g, '-');
    const solution = fileObject.solution;
    const dir = './solutions'; //TODO:unique dir to avoid clashes
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`./solutions/${challenge}${isHtml(solution) ? '.html' : '.js'}`, solution);
    const dirArray = fs.readdirSync(dir);
    if (dirArray.length === count) {
        newArchive(`${camper}-archive-${+new Date}.zip`, dirArray);
    }
}

const newArchive = (zipFileName, pathNames) => {
  const zipfile = new yazl.ZipFile();
  
  pathNames.forEach(target => {
      const joinedTarget = path.join('./solutions/', target);//TODO:solutions should be unique again
      const p = stat(joinedTarget);
          if (p.isFile()) {
              zipfile.addFile(joinedTarget, joinedTarget);
          }
  });
  zipfile.outputStream.pipe(fs.createWriteStream(zipFileName)).on("close", () => {
      console.log('Zip complete.');
      rimraf.sync('./solutions'); //TODO:this should be the same as above
      return zipFileName;
    });
  zipfile.end();
}

const writeSolutions = (camper, res) => {
  buildLinkList(camper)
    .then((links) => {
        const count = links.length;
        for (let link of links) {
          writeFile(getSolution(link), count, camper);
        }
    });
  }

module.exports = writeSolutions;
