import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    phone: {
        type: String,
        minlength: 5
    },
    street: {
        type: String,
        required: true,
        minlength: 5
    },
    city: {
        type: String,
        required: true,
        minlength: 5
    }
}, { collection: "persons" })

personSchema.set('toJSON', {
    transform: (document, retunedObject) => {
        returnedObject.id = retunedObject._id
        delete retunedObject._id
        delete retunedObject.__v
    }
})
const Person = mongoose.model('Person', personSchema)

export default Person