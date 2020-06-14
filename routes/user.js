const express = require('express');
const route = express.Router();

const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator/check');
const { Op } = require('sequelize');
const User = require('../models/user');

// Register
route.post('/register', [
  check('name').isLength({ min: 5 }),
  check('password').isLength({ min: 5 }),
  check('email').isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors });

  const nameOrEmailUsedAlrdy = await User.findOne({
    where: {
      [Op.or]: [
        { name: req.body.name },
        { email: req.body.email }
      ]
    }
  })

  if (nameOrEmailUsedAlrdy !== null) {
    return res.status(409).send({
      msg: 'Nama atau email sudah digunakan.'
    });
  }

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        msg: err
      });
    }

    return User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: 0
    }).then(newUser => {
      res.json({
        code: 200,
        message: 'Registrasi berhasil dilakukan.',
        data: newUser
      })
    })
  })
  return 0;
})

module.exports = route;
