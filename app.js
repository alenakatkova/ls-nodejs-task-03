const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  'secret': 'loftschool',
  'resave': false,
  'saveUninitialized': false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('pages/error', {
    message: err.message,
    error: err,
    status: err.status
  });
});

const server = app.listen(process.env.PORT || 3000, () => {
  if (!fs.existsSync('./public/upload')) {
    fs.mkdirSync('./public/upload');
  }

  console.log('Сервер запущен на порте: ' + server.address().port);
});
