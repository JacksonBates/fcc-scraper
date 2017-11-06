const yazl = require('yazl');
const rimraf = require('rimraf');
const fs = require('fs');
const stat = fs.statSync;
const path = require('path');
const cwd = `${process.env.PWD}/public` || 'public';
console.log(cwd);

module.exports = (zipFileName, pathNames, camper) => {
  const zipfile = new yazl.ZipFile();
  
  pathNames.forEach(target => {
      const joinedTarget = path.join(`./solutions-${camper}/`, target);
      const p = stat(joinedTarget);
          if (p.isFile()) {
              zipfile.addFile(joinedTarget, joinedTarget);
          }
  });
  zipfile.outputStream.pipe(fs.createWriteStream(`${cwd}/${zipFileName}`)).on("close", () => {
      console.log('Zip complete.');
      rimraf.sync(`./solutions-${camper}`); 
    });
  zipfile.end();
}
