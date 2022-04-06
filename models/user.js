import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const Schema = mongoose.Schema
const model = mongoose.model

// I used this schema in the tutorial of mongo

/* const userSchema = new Schema({
    username : {
        type: String,
        unique: true,
    },
    name: String,
    passwordHash : String,
    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'Post'  
    }]
}) */

// Shcema for mongo and graphql

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }]
})

/* userSchema.plugin(uniqueValidator) */

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id

        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = model('User', userSchema)

//Creating a new user.

/* const newUser = new User({
    username: 'Juan-seb',
    name: 'Juan Sebastian Angulo',
    passwordHash: bcrypt.hashSync('12345678',10),
    posts : []
})

newUser.save()
    .then((result) => {
        console.log('User saved')
        mongoose.connection.close()
    })
    .catch((err) => {
        console.log(err)
    })
 */
export { User }

