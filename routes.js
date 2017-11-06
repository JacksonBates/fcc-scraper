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
        })
      .then(() => {
        wait(5000, () => {
          console.log('bout to send');
          res.render('pages/download', { link: `${camper}.zip`});
          // res.download(`${__dirname}/${camper}.zip`);
        });
      })
      .catch((err) => {
        console.log(err);
        res.render('pages/bad');
      });
})

module.exports = router;