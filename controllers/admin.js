const db = require('../models/db')();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const validation = require('../libs/validation');

module.exports.getAdmin = function (req, res) {
  res.render('pages/admin', {
    msgskill: req.flash('skillsErrMsg'),
    msgfile: req.flash('uploadErrMsg')
  });
};

module.exports.sendSkills = (req, res, next) => {
  const { age, concerts, cities, years } = req.body;

  let isValid = validation.validateFields(req.body);
  if (!isValid) {
    req.flash('skillsErrMsg', 'Поля не заполнены');
    return res.redirect(`/admin?msg=Поля не заполнены`);
  }

  let skills = db.get('skills') || [];
  skills.push({
    age: age,
    concerts: concerts,
    cities: cities,
    years: years
  });

  db.set('skills', [ ...skills ]);
  db.save();

  req.flash('success', 'Данные отправлены');
  return res.redirect(`/admin?msg=Данные отправлены`);
};

module.exports.uploadGood = (req, res, next) => {
  let form = new formidable.IncomingForm();
  let upload = './public/upload';
  let fileName;

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }

    let areFieldsValidValid = validation.validateFields(fields);
    let isFileValid = validation.validateUpload(files.photo);

    if (!areFieldsValidValid || !isFileValid) {
      req.flash('uploadErrMsg', 'Заполните все поля');
      return res.redirect(`/admin?msg=Заполните все поля`);
    }

    fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err);
        fs.unlinkSync(fileName);
        fs.rename(files.photo.path, fileName);
      }

      let goods = db.get('goods') || [];
      goods.push({
        photo: files.photo.name,
        src: path.join('./upload', files.photo.name),
        name: fields.name,
        price: fields.price
      });
      db.set('goods', [ ...goods ]);
      db.save();

      req.flash('success', 'Товар загружен');
      return res.redirect(`/?msg=Товар загружен`);
    });
  });
};
