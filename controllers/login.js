const db = require('../models/db')();
const psw = require('../libs/password');
const validateFields = require('../libs/validation').validateFields;

module.exports.getLogin = (req, res) => {
  res.render('pages/login', { msgslogin: req.flash('error') });
};

let email = '';
let hash = '';
let salt = '';
let password = {};

module.exports.sendLogin = (req, res, next) => {
  let isValid = validateFields(req.body);
  if (!isValid) {
    req.flash('error', 'Заполните все поля');
    return res.redirect('/login?msg=Заполните все поля');
  }

  email = req.body.email;
  password = psw.setPassword(req.body.password);
  hash = password.hash;
  salt = password.salt;

  db.set('user', {
    email: email,
    password: { hash, salt }
  });

  db.save();

  req.flash('success', 'Вы авторизованы');
  return res.redirect('/?msg=Вы авторизованы');
};
