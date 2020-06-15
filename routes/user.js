const express = require('express');
const route = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator/check');
const { Op } = require('sequelize');
const User = require('../models/user');
require('dotenv').config();

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
        msg: 'Registrasi berhasil dilakukan.',
        data: newUser
      })
    })
  })
  return 0;
})

// Login
route.post('/login', [
  check('name').isLength({ min: 1 }),
  check('password').isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors });

  const userWithInputtedName = await User.findOne({
    where: {
      name: req.body.name
    }
  });

  if (userWithInputtedName === null) {
    return res.status(401).send({
      msg: 'Nama atau password salah.'
    });
  }

  bcrypt.compare(req.body.password, userWithInputtedName.password, (bErr, bResult) => {
    if (bErr) {
      return res.status(401).send({
        msg: 'Nama atau password salah.'
      });
    }

    if (bResult) {
      const token = jwt.sign({
        name: userWithInputtedName.name,
        id_user: userWithInputtedName.user_id
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '7d'
      });

      return res.status(200).send({
        msg: 'Login berhasil dilakukan.',
        token,
        user: userWithInputtedName
      })
    }
    return res.status(401).send({
      msg: 'Nama atau password salah.'
    });
  })
})

module.exports = route;
