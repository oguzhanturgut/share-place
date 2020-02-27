const { v4: uuid } = require('uuid');

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'abc@example.com',
    password: 'testers',
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const user = DUMMY_USERS.find(user => user.email === email);
  if (user) throw new HttpError('User already exists', 422);
  const newUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  DUMMY_USERS = [...DUMMY_USERS, newUser];
  res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const validUser = DUMMY_USERS.find(user => user.email === email);
  if (!validUser || validUser.password !== password)
    throw new HttpError('User not found or password is wrong', 401);
  res.status(200).json({ message: 'Logged in' });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
