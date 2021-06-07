console.log('Server-side code running');

const express = require('express');

const app = express();


app.set('view engine', 'ejs');


// serve files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    uuidvar: req.query.uuid,
  });
});

app.listen(8080, () => {
  console.log('listening on 8080');
});