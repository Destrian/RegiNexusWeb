console.log('Server-side code running');

const express = require('express');

const app = express();


app.set('view engine', 'ejs');


// serve files from the public directory
app.use(express.static('public'));

app.get('/reginexus', (req, res) => {
  res.render('reginexus', {
    uuidvar: req.query.uuid,
  });
});

app.get('/deposit', (req, res) => {
  res.render('deposit', {
  });
});

app.listen(80, () => {
  console.log('listening on 80');
});