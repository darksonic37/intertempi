require('dotenv').config()

const express = require('express')
const cors = require('cors')
const uuidv4 = require('uuid/v4')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/users', (req, res) => {
  res.json({ users: [] })
})

app.post('/users', (req, res) => {
  let token = uuidv4()
  res.json({ token: token })
})

app.listen(process.env.APP_PORT, () => {
  console.log(`App listening on port http://${process.env.APP_HOST}:${process.env.APP_PORT}!`)
})
