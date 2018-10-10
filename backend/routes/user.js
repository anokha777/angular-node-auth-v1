const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then( hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then((result) => {
        res.status(200).json({
          message: 'User created!',
          result: result
        });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if(!user) {
      return res.status(401).json({
        message: 'Auth Failed'
      });
    }
    return bcrypt.compare(req.body.password, user.password);
  }).then((result) => {
    if(!result) {
      return res.status(401).json({
        message: 'Auth Failed'
      });
    }
    const token = jwt.sign({email: user.email, userId: user._id},
      'This_is_secret_string',
      { expiresIn: '1h' });
  }).catch((err) => {
    return res.status(401).json({
      message: 'Auth Failed'
    });
  });
});

module.exports = router;
