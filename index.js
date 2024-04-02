const express = require('express')
const app = express()
const PORT = 4003

app.get('/', (req, res) => {
  console.log('Hello World')
  res.send('Hello world')
})

app.listen(PORT, () => {
  console.log('App running on port', 4003)
})
