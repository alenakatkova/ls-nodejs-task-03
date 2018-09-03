const db = require('../models/db')();
const psw = require('../libs/password');
const validateFields = require('../libs/validation').validateFields;

// Обработка GET запроса. Рендеринг страницы login
module.exports.getLogin = (req, res) => {
  res.render('pages/login', { title: 'Login page' });
};

// Обработка POST запроса. Сохранение данных пользователя в БД
module.exports.sendLogin = (req, res, next) => {
  // Валидация формы
  let isValid = validateFields(req.body);
  if (!isValid) {
    req.flash('error', 'Заполните все поля');
    return res.render('pages/login', { msgslogin: req.flash('error') });
  }

  const { email, password } = req.body;
  const user = db.get('user');

  if (user.email === email && psw.validPassword(password)) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    req.flash('error', 'Неправильные имя пользователя или пароль');
    return res.render('pages/login', { msgslogin: req.flash('error') });
  }
};
