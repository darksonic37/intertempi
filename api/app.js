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
})

app.post('/users', (req, res) => {
  let token = uuidv4()
  res.json({ token: token })
})

app.listen(process.env.APP_PORT, () => {
  console.log(`App listening on port http://${process.env.APP_HOST}:${process.env.APP_PORT}!`)
})
