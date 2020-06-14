const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const todo = require('./routes/todo');
app.use(todo);
const user = require('./routes/user');
app.use('/user', user);

let port = 5000;

app.get('/', (req, res) => {
  res.send('Server running in port: ' + port);
});

app.listen(port);
