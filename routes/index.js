const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

router.get('/', ctrlHome.getHome);
router.post('/', ctrlHome.sendEmail);

router.get('/login', ctrlLogin.getLogin);
router.post('/login', ctrlLogin.sendLogin);

router.get('/admin', ctrlAdmin.getAdmin);
router.post('/admin/skills', ctrlAdmin.sendSkills);
router.post('/admin/upload', ctrlAdmin.uploadGood);

module.exports = router;
