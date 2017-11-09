const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes'));
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.listen(app.get('port'), () => {
  console.log('Node app running on port ', app.get('port'));
});