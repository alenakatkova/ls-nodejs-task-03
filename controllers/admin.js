const db = require('../models/db')();
const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports.getAdmin = function (req, res) {
  res.render('pages/admin', { title: 'Admin' });
};

module.exports.sendSkills = (req, res, next) => {
  const { age, concerts, cities, years } = req.body;
  if (!age || !concerts || !cities || !years) {
    req.flash('error', 'Заполните все поля');
    return res.render('pages/admin', { msgskill: req.flash('error') });
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

  req.flash('success', 'Ваши данные были отправлены');
  res.redirect('/admin');
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
        name: fields.name,
        price: fields.price
      });
      db.set('goods', [ ... goods ]);
      db.save();
      res.redirect('/?msg=Картинка успешно загружена');
    });
  });
};
