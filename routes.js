const express = require( 'express' );
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
// const getSolutionZip = require('./controllers/getSolutionZip');
const zip = require('express-zip');

// Homepage for the app, 
router.get( '/', (req, res) => {
  if (req.query.username) {
    const camper = req.query.username;
    res.redirect(camper);
  } 
  res.render('pages/home');
});

router.get('/:camper', (req, res) => {
  const camper = req.params.camper;
  const buildLinkList = require('./controllers/buildLinkList');
  const getSolution = require('./controllers/getSolution');
  const writeFile = require('./controllers/writeFile');
  const wait = require('wait').wait;

  buildLinkList(camper)
      .then((links) => {
          const count = links.length;
          links.forEach((link) => {
              writeFile(getSolution(link), count, camper);
          });
          //     writeFile(getSolution(link), count, camper);
          // }
        })
      .then(() => {
        wait(500, () => {
          console.log('bout to send');
          res.download(`${__dirname}/${camper}.zip`);
        });
        // wait(1000, () => {
        //   console.log('see ya');
        //   res.end();
        //   res.redirect('/');
        // });
      });
        // for (let link of links) {
  // const zipFileName = await getSolutionZip(camper);
  // res.sendFile(`${__dirname}/${zipFileName}`);
})

router.get('/test', (req, res) => {
  res.zip([
    {path: './test.file', name: './test.file'}
  ]);
});

router.get('/send', (req, res) => {
  res.sendFile(__dirname + '/test.file', {

  });
});

module.exports = router;