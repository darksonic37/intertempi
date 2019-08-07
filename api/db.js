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

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
)

const SessionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    token: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true
  }
)

const UserModel = mongoose.model('User', UserSchema)
const SessionModel = mongoose.model('Session', SessionSchema)

module.exports = { mongoose, UserModel, SessionModel }
