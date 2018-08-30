const db = require('../models/db')();
const express = require('express');

module.exports.getHome = function (req, res) {
  res.render('pages/index', { title: 'Home' });
};

module.exports.sendEmail = (req, res, next) => {
  if (!req.body.email || !req.body.name || !req.body.message) {
    req.flash('error', 'Заполните все поля');
    return res.render('pages/index', { msgsemail: req.flash('error') });
  }

  let emails = db.get('emails') || [];
  emails.push({
    email: req.body.email,
    name: req.body.name,
    message: req.body.message
  });

  db.set('emails', [ ...emails ]);

  db.save();

  req.flash('success', 'Ваше сообщение было отправлено');
  res.render('pages/index', { msgsemail: req.flash('success') });
};
