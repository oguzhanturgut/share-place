const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersController.getUsers);
router.post(
  '/signup',
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name can not be empty'),
    check('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Email is not valid'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password should be more than 6 characters'),
  ],
  usersController.signup,
);
router.post('/login', usersController.login);

module.exports = router;
