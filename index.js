import { ApolloServer, UserInputError, gql, AuthenticationError } from "apollo-server"
import './mongoConnector.js'
import Person from "./models/person.js"
import jwt from 'jsonwebtoken'
import { User } from './models/user.js'
import { PubSub } from "graphql-subscriptions"

const JWT_SECRET = 'Palabra_secreta'
const pubsub = new PubSub()

const typeDefs = gql`

  enum YesNo {
    YES
    NO
  }

  type Adress{
    street: String!
    city: String!
  }

  type Person{
    name: String!
    phone: String
    adress: Adress!
    id: ID!
  }

  type User{
    username: String!
    friends: [Person]!
    id: ID!
  }

  type Token{
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
    me: User
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(
      name: String!
      phone: String!
    ): Person

      createUser(
        username: String!
      ):User

      login(
        username: String!
        password: String!
      ):Token

      addAsFriend(
        name: String!
      ):User
  }

  type Subscription {
    personAdded: Person!
  }

`

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      /* try {
          const data = await fetch("http://localhost:5000/persons");
          const json = await data.json();

          if (!args.phone) return json;

          return json.filter(person => args.phone === "YES" ? person.phone : !person.phone);
      } catch (error) {
          console.log(error);
      } */


      //if (!args.phone) return persons;

      /*Si es un yes devuelve todas las que tengan phone */
      //return persons.filter(person => args.phone === "YES" ? person.phone : !person.phone);

      // With mongo DB

      if (!args.phone) return await Person.find({})

      return await Person.find({ phone: { $exists: args.phone === 'YES' } })

    },
    findPerson: async (root, args) => {
      const { name } = args
      //return persons.find(person => person.name === name);
      return await Person.findOne({ name })
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addPerson: async (root, args, context) => {

      // In the schema in mongo can use the unique validator for this validations

      /* if (persons.find(p => p.name === args.name)) {
          throw new UserInputError("Name must be unique", {
              invalidArgs: args.name
          })
      } */


      const { currentUser } = context
      if (!currentUser) throw new AuthenticationError('not authenticated')

      //const { name, phone, street, city } = args
      const person = new Person({ ...args })

      try {

        const personSave = await person.save()
        currentUser.friends = currentUser.friends.concat(personSave)

        await currentUser.save()

      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      pubsub.publish('PERSON_ADDED', { personAdded: person })
      return person

    },
    editNumber: async (root, args) => {

      //const { name, phone } = args

      try {
        const person = await Person.findOneAndUpdate({ name: args.name }, {
          phone: args.phone
        }, {
          new: true,
          // Features that i can put in this object

          /* upsert: true,
          setDefaultsOnInsert: true, */
          runValidators: true,
          /* context: 'query', */
        })

        if (!person) return new UserInputError('La persona no esta registrada en la base de datos')

        // If the DB didn´t find the document return null
        return person
      } catch (error) {
        return new UserInputError(error.message, {
          invalidArgs: args.phone
        })

      }

      /* const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      return person.save() */

      //Important: return the updated person
      /* return updatedPerson; */

    },
    createUser: (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args.username
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'chanpassword') {
        throw new UserInputError('wrong credentials')
      }
      const userToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userToken, JWT_SECRET)
      }

    },
    addAsFriend: async (root, args, context) => {

      const { currentUser } = context

      const friend = await Person.findOne({ name: args.name })

      if (!friend) throw new UserInputError('Invalid friend name')

      // This function return true if the id of the person exists in the array friends of the user
      const nonFriendlyAlready = personToFriend => currentUser.friends
        .map(p => p._id)
        .includes(personToFriend._id)

      if (!nonFriendlyAlready(friend)) throw new UserInputError('The friend is already added')

      try {

        // In this case concat all the object in the array friends, and only the id of the friend is saved, 
        // if I put ._id graphQL return a error

        currentUser.friends = currentUser.friends.concat(friend)
        await currentUser.save()

      } catch (error) {
        console.log(error)
      }

      return currentUser

    }
  },
  Person: {
    adress: (root) => {
      return {
        city: root.city,
        street: root.street
      }
    }
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED'),
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const token = auth.substring(7)

      try {
        const { id } = jwt.verify(token, JWT_SECRET)
        const currentUser = await User.findById(id).populate('friends')
        return { currentUser }

      } catch (error) {
        console.log(error)
      }
    }
  },
  playground: true
})


server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`)

})
