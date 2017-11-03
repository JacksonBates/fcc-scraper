const express = require( 'express' );
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const getSolutionZip = require('./controllers/getSolutionZip');
const zip = require('express-zip');

// Homepage for the app, 
router.get( '/', (req, res) => {
  if (req.query.username) {
    const camper = req.query.username;
    res.redirect(camper);
  } 
  res.render('pages/home');
});

router.get('/:camper', async (req, res) => {
  const camper = req.params.camper;
  const file = await getSolutionZip(camper);
  res.sendFile(`${__dirname}/${file}`);
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