require('dotenv').config()

const express = require('express')
const cors = require('cors')
const uuidv4 = require('uuid/v4')
const app = express()

app.use(express.json())
app.use(cors())

const mongoose = require('mongoose')
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, { useNewUrlParser: true })
mongoose.connection.once('open', () => console.log('MongoDB connection success'))
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error'))

const schemas = require('./schemas')
let UserModel = mongoose.model('User', schemas.UserSchema)

// get all users, ignoring pagination
app.get('/users', async (req, res) => {
  try {
    let users = await UserModel.find().sort({_id:1})
    return res.json({ error: '', users: users})
  } catch(err) {
    return res.json({ error: err, users: [] })
  }
})

// post a new user, returning a token for immediate login
app.post('/users', (req, res) => {
  let token = uuidv4()
  res.json({ token: token })
})

// start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
})
