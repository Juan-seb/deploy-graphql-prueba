import mongoose from "mongoose"
// Connect to the DB
import './mongoConnector.js'
import { Post } from "./models/post.js"
import { User } from "./models/user.js"

// Create a post and relation with a user.
const createNote = async () => {

    // Get the user to whom the post will be related
    const userById = await User.findById("619d74a16fc0560b46e440f3")

    // Create the post in the field user link to the user
    const newPost = new Post({
        name: "Juan Felipe ita",
        user: "Felipito_ito",
        img: "http://mamita.com/mageadf",
        likes: [1, 2, 4],
        user: userById._id
    })

    try {
        const postSaved = await newPost.save()

        // Relation the user with the posts
        userById.posts = userById.posts.concat(postSaved._id)
        await userById.save()
        mongoose.connection.close()
        
    } catch (error) {
        console.log(error)
    }
}

const getAllPosts = async (userID) => {

    /* const postsUser = await User.findById(userID).populate("posts",{
        name: 1,
        img:1,
        likes:1,
        _id:0
    }) */

    // Obtain all users in the DB
    const postsUser = await User.find({})
    const response = []

    // For each user populate the posts and return in and array.
    postsUser.forEach(async (user) => {
        const userPost = await user.populate("posts",{
            name: 1,
            img:1
        })
        console.log(userPost)
        response.push(userPost.posts)

        // IMPORTANT: Close the connection
        mongoose.connection.close()
        console.log(response)
    })


}

// Create a new post and relation it to the user
//createNote()

getAllPosts("619d74a16fc0560b46e440f3")