const db = require('../models/db')();
const express = require('express');
const psw = require('../libs/password');

module.exports.getLogin = (req, res) => {
  res.render('pages/login', { title: 'Login' });
};

let email = '';
let hash = '';
let salt = '';
let password = {};

module.exports.sendLogin = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    req.flash('error', 'Заполните все поля');

    return res.render('pages/login', { msgslogin: req.flash('error') });
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

  req.session.isAdmin = true;
  return res.redirect('/admin');
};
