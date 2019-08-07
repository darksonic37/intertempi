const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

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

UserSchema.pre('save', function(next) {
    var user = this

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next()

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)

            // override the cleartext password with the hashed one
            user.password = hash
            next()
        });
    });
})

const SessionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
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

module.exports = { UserModel, SessionModel }
