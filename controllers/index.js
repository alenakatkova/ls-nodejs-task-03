const db = require('../models/db')();
const validateFields = require('../libs/validation').validateFields;

// Обработка GET запроса. Рендеринг главной страницы
module.exports.getHome = function (req, res) {
  res.render('pages/index', {
    msgsemail: req.flash('error'),
    goods: db.get('goods'),
    skills: db.get('skills')
  });
};

// Обработка POST запроса. Сохранение сообщения от пользователя в БД
module.exports.sendEmail = (req, res, next) => {
  const { email, name, message } = req.body;

  let isValid = validateFields(req.body);
  if (!isValid) {
    req.flash('error', 'Заполните все поля');
    return res.redirect('/?msg=Поля не заполнены');
  }

  // Запись нового сообщения от пользователя в БД
  let emails = db.get('emails') || [];
  emails.push({
    email: email,
    name: name,
    message: message
  });

  db.set('emails', [ ...emails ]);
  db.save();

  req.flash('success', 'Ваше сообщение было отправлено');
  return res.redirect('/?msg=Сообщение отправлено');
};
