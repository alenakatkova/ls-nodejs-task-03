const db = require('../models/db')();
const psw = require('../libs/password');
const validateFields = require('../libs/validation').validateFields;

let hash = '';
let salt = '';
let password = {};

// Обработка GET запроса. Рендеринг страницы login
module.exports.getLogin = (req, res) => {
  res.render('pages/login', { msgslogin: req.flash('error') });
};

// Обработка POST запроса. Сохранение данных пользователя в БД
module.exports.sendLogin = (req, res, next) => {
  // Валидация формы
  let isValid = validateFields(req.body);
  if (!isValid) {
    req.flash('error', 'Заполните все поля');
    return res.redirect('/login?msg=Заполните все поля');
  }

  // Шифрование пароля
  password = psw.setPassword(req.body.password);
  hash = password.hash;
  salt = password.salt;

  // Запись данных пользователя в БД
  db.set('user', {
    email: req.body.email,
    password: { hash, salt }
  });
  db.save();

  req.flash('success', 'Вы авторизованы');
  return res.redirect('/admin?msg=Вы авторизованы');
};
