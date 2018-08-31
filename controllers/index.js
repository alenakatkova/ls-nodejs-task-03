const db = require('../models/db')();
const validateFields = require('../libs/validation').validateFields;

module.exports.getHome = function (req, res) {
  res.render('pages/index', {
    msgsemail: req.flash('error'),
    goods: db.get('goods')
  });
};

module.exports.sendEmail = (req, res, next) => {
  const { email, name, message } = req.body;

  let isValid = validateFields(req.body);
  if (!isValid) {
    req.flash('error', 'Заполните все поля');
    return res.redirect('/?msg=Поля не заполнены');
  }

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
