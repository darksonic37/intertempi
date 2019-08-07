require('dotenv').config()

const express = require('express')
const cors = require('cors')
const uuidv4 = require('uuid/v4')
const app = express()

app.use(express.json())
app.use(cors())

// TODO: refactor into db file
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`, { useNewUrlParser: true })

mongoose.connection.once('open', () => {
  console.log('MongoDB connection success')
})

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error', err)
  process.exit()
})

const schemas = require('./schemas')
let UserModel = mongoose.model('User', schemas.UserSchema)
let SessionModel = mongoose.model('Session', schemas.SessionSchema)

// get all users, ignoring pagination
app.get('/users', async (req, res) => {
  try {
    let users = await UserModel.find(null, '-_id username').sort({_id:1})
    return res.status(200).json({ error: '', users: users })
  } catch(err) {
    return res.status(200).json({ error: err, users: [] })
  }
})

// post a new user, returning a token for immediate login
app.post('/users', async (req, res) => {
  let username = req.body.username
  let password = req.body.password

  // save user
  try {
    // TODO: hash password
    let user = new UserModel({ username: username, password: password })
    await user.save()
  } catch(err) {
    return res.status(400).send(`Error: request body is invalid`)
  }

  // create session and return session token for immediate login
  let token = uuidv4()
  let session = new SessionModel({ username: username, token: token })
  try {
    await session.save()
    return res.status(200).json({ token: token })
  } catch(err) {
    return res.status(400).send(`Error: token must be unique`)
  }
})

// start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
})
