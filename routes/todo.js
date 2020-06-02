const express = require('express')
const route = express.Router()
const { check, validationResult } = require('express-validator/check');
const todo = require('../models/todo')

route.get('/todo', (req, res) => {
  todo.findAll().then(data => {
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
  })
})

route.get('/todo/:id', (req, res) => {
  todo.findOne({
    where: { id_todo: req.params.id }
  }).then(data => {
    res.json({
      code: 200,
      message: 'success',
      data: data
    })
  })
})

route.post('/todo', [
  check('title')
    .isLength({ min: 5 }),
  check('description')
    .isLength({ min: 5 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors });
  }

  return todo.create({
    title: req.body.title,
    description: req.body.description
  }).then(newTodo => {
    res.json({
      code: 200,
      message: 'success',
      data: newTodo
    })
  })
})

route.put('/todo/:id', (req, res) => {
  const id = req.params.id
  todo.findOne({ where: { id_todo: req.params.id } }).then(data => {
    if (!data) {
      return res.json({
        status: 'success',
        message: 'ID not valid',
        data: []
      })
    } 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors });
    }

    const update = {
      title: req.body.title,
      description: req.body.description
    }

    return todo.update(update, { where: { id_todo: id } })
      .then(
        res.json({
          status: 'success',
          message: 'todo updated',
          data: update
        })
      )
  })
})

route.delete('/todo/:id', (req, res) => {
  const id = req.params.id
  todo.findOne({ where: { id_todo: req.params.id } }).then(data => {
    if (!data) {
      return res.json({
        status: 'success',
        message: 'ID not valid',
        data: []
      })
    }

    return todo.destroy({ where: { id_todo: id } })
      .then(
        res.json({
          status: 'success',
          message: 'todo deleted',
          data: null
        })
      )
  })
})

module.exports = route
