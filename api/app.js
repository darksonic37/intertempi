const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const uuidv4 = require('uuid/v4')
const app = express()

app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

// mongo
const db = require('./db')

// authorization middleware
const isAuthorized = async (req, res, next) => {
  let authorization = req.headers.authorization
  if (!authorization) {
    return res.status(401).json({ error: 'Missing authorization header' })
  }

  let type = authorization.split(' ')[0]
  let token = authorization.split(' ')[1]
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Misconstructed authorization header' })
  }

  let session = await db.SessionModel.findOne({ token: token })
  if (session) {
    next()
  } else {
    return res.status(403).json({ error: 'Unauthorized' })
  }
}

// get all users, ignoring pagination
app.get('/users', isAuthorized, async (req, res) => {
  try {
    let users = await db.UserModel.find(null, '-_id username').sort({_id:1})
    return res.status(200).json({ error: null, users: users })
  } catch(err) {
    return res.status(200).json({ error: err, users: [] })
  }
})

// post a new user
app.post('/users', async (req, res) => {
  let username = req.body.username
  let password = req.body.password

  // save user
  try {
    let user = new db.UserModel({ username: username, password: password })
    await user.save()
    return res.status(200).json({ error: null, user: user })
  } catch(err) {
    return res.status(400).json({ error: `Error: request body is invalid (invalid JSON structure, empty username or password keys, or taken username)` })
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
        return res.status(200).json({ error: null, token: token })
      } catch(err) {
        return res.status(400).json({ error: `Error: token must be unique` })
      }
    } else {
      return res.status(401).json({ error: 'Error: invalid password' })
    }
  } else {
    return res.status(401).json({ error: `Error: username does not exist` })
  }
})

// logout destroys all tokens given any of the user's tokens
app.post('/logout', async (req, res) => {
  let token = req.body.token

  try {
    let session = await db.SessionModel.findOne({ token: token })
    await db.SessionModel.deleteMany({ username: session.username })
    return res.status(200).json({ error: null })
  } catch(err) {
    return res.status(401).json({ error: `Error: invalid token` })
  }
})

// start the server
app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
})
