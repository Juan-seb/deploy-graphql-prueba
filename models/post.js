import mongoose from 'mongoose'

const Schema = mongoose.Schema

const postSchema = new Schema({
    name: String,
    user: String,
    img: String,
    likes: Array,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Post = mongoose.model('Post', postSchema)

export { Post }

// Test Schema

/* const testSchema = new mongoose.Schema({
    name: String,
    user: String,
    img: String,
    likes: Array,
}) */

// Return the schema object in JSON format.

/* testSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
}); */

// Find the document in the DB, use the model.

/* Test.find({})
    .then(result => {
        console.log(result)
        mongoose.connection.close()
    }) */

// Insert a document in the DB

/* const testData = new Test({
    name: 'Esto es una prueba',
    user: 'Felipe',
    img: 'http://insta.com/lafotito',
    likes: ['Juan', 'Mamita']
})

testData.save().
    then((result) => {
        console.log(result)
        mongoose.connection.close()
    })
    .catch((err) => {
        console.log(err)
    }) */