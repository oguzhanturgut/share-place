const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find().select("-password");
  } catch (error) {
    return next(new HttpError("Fetching users failed"), 500);
  }
  res
    .status(200)
    .json({users: users.map(user => user.toObject({getters: true}))});
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(
      new HttpError(
        errors
          .array()
          .map(e => e.msg)
          .join("\n"),
        422
      )
    );

  const {name, email, password} = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({email});
  } catch (error) {
    return next(new HttpError("Signing up failed"), 500);
  }

  if (existingUser) return next(new HttpError("User exists already"), 422);

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not generate user", 500));
  }

  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed"), 500);
  }

  let token;
  try {
    token = jwt.sign(
      {userId: newUser.id, email: newUser.email},
      process.env.JWT_KEY,
      {
        expiresIn: "1d"
      }
    );
  } catch (error) {
    return next(new HttpError("Signing up failed"), 500);
  }

  res.status(201).json({userId: newUser.id, email: newUser.email, token});
};

const login = async (req, res, next) => {
  const {email, password} = req.body;
  let validUser;
  try {
    validUser = await User.findOne({email});
  } catch (error) {
    return next(new HttpError("Login failed"), 500);
  }

  if (!validUser) return next(new HttpError("Invalid credentials", 401));

  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, validUser.password);
  } catch (error) {
    return next(new HttpError("Could not login", 500));
  }

  if (!validPassword) return next(new HttpError("Invalid credentials", 401));

  let token;
  try {
    token = jwt.sign(
      {userId: validUser.id, email: validUser.email},
      process.env.JWT_KEY,
      {
        expiresIn: "1d"
      }
    );
  } catch (error) {
    return next(new HttpError("Login failed"), 500);
  }

  res.status(200).json({userId: validUser.id, email: validUser.email, token});
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
