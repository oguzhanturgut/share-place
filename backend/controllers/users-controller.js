const { validationResult } = require('express-validator');

const User = require('../models/user');

const HttpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find().select('-password');
  } catch (error) {
    return next(new HttpError('Fetching users failed'), 500);
  }
  res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError(
        errors
          .array()
          .map(e => e.msg)
          .join('\n'),
        422,
      ),
    );

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Signing up failed'), 500);
  }

  if (existingUser) return next(new HttpError('User exists already'), 422);

  const newUser = new User({
    name,
    email,
    image: 'https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg',
    password,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError('Signing up failed'), 500);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let validUser;
  try {
    validUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Login failed'), 500);
  }

  if (!validUser || validUser.password !== password)
    return next(new HttpError('Invalid credentials', 401));
  res.status(200).json({ message: 'Logged in', user: validUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
