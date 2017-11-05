const yazl = require('yazl');
const rimraf = require('rimraf');
const fs = require('fs');
const stat = fs.statSync;
const path = require('path');

module.exports = (zipFileName, pathNames) => {
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
    });
  zipfile.end();
}
