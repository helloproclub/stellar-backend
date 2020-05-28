const bodyParser = require('body-parser')
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Server Worked')
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(5000)
