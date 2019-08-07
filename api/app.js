require('dotenv').config()

const express = require('express')
const cors = require('cors')
const uuidv4 = require('uuid/v4')
const app = express()

app.use(express.json())
app.use(cors())

// mongo
const db = require('./db')

// get all users, ignoring pagination
app.get('/users', async (req, res) => {
  try {
    let users = await db.UserModel.find(null, '-_id username').sort({_id:1})
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
    let user = new db.UserModel({ username: username, password: password })
    await user.save()
    return res.status(200).json({ user: user })
  } catch(err) {
    return res.status(400).send(`Error: request body is invalid (invalid JSON structure, empty username or password keys, or taken username)`)
  }
})

// login the user
app.post('/login', async (req, res) => {
  let username = req.body.username
  let password = req.body.password

  let user = await db.UserModel.findOne({ username: username })
  if(user) {
    const match = await user.comparePassword(password, user.password)

    if (match) {
      // create new token
      let token = uuidv4()
      let session = new db.SessionModel({ username: username, token: token })
      try {
        await session.save()
        return res.status(200).json({ token: token })
      } catch(err) {
        return res.status(400).send(`Error: token must be unique`)
      }
    } else {
      return res.status(401).send('Error: invalid password')
    }
  } else {
    return res.status(401).send(`Error: username does not exist`)
  }
})

// logout destroys all tokens given any of the user's tokens
app.post('/logout', async (req, res) => {
  let token = req.body.token

  try {
    let session = await db.SessionModel.findOne({ token: token })
    await db.SessionModel.deleteMany({ username: session.username })
    return res.status(200).send()
  } catch(err) {
    return res.status(401).send(`Error: invalid token`)
  }
})

// start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
})
