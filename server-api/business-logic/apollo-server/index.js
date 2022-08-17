import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from '@graphql-tools/schema'
import createDBConnection from 'server-api/data-access/mongo-db'
import * as Resolvers from './resolvers'
import * as Schemas from './schemas'
import * as MutationResolvers from './mutation-resolvers'
import * as CustomTypes from './custom-types'
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core'
import jwt from 'jsonwebtoken'

// join all schemas together in one string
const getSchemas = module => {
  const values = Object.values(module)
  const usingStrings = typeof values[0] === 'string'
  const schemas = usingStrings ? values : values.map(({ schema }) => schema)
  return schemas.join()
}

// get resolvers as key/value pairs
const getResolvers = module => Object.keys(module).reduce((resolvers, key) => {
  resolvers[key] = module[key].resolver
  return resolvers
}, {})

// build the typeDefs string dynamically, so all the
// schemas can be defined in their own respective files
const typeDefs = gql`
${CustomTypes.ScalarDate}
${CustomTypes.ScalarUpload}
${getSchemas(Schemas)}
type Query {
  ${getSchemas(Resolvers)}
}
type Mutation {
  ${getSchemas(MutationResolvers)}
}`

// build the resolvers object dynamically, so all the
// resolvers can be defined in their own respective files
const resolvers = Object.assign({}, {
  Date: CustomTypes.Date,
  Upload: CustomTypes.Upload,
  Query: getResolvers(Resolvers),
  Mutation: getResolvers(MutationResolvers),
})

const startServer = async () => {
  const api = await createDBConnection()
  const apolloServer = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req }) => {
      const token = (req.headers.authorization || 'bearer ').split(' ')[1]
      const DEFAULT_CONTEXT = { user: null }
      if (!token) return DEFAULT_CONTEXT
      try {
        return { user: jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) }
      } catch (err) {
        console.warn(err)
        return DEFAULT_CONTEXT
      }
    },
    dataSources: () => ({ api }),
  })
  await apolloServer.start()
  return apolloServer
}

// exporting a promise allows the server to initialize and start only once;
// a consumer which awaits a promise that is already resolved will safely
// and instantly resolve the value, rather than running the script again.
const apolloPromise = startServer()

export default apolloPromise
