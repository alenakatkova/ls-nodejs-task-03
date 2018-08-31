const db = require('../models/db')();
const express = require('express');

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
