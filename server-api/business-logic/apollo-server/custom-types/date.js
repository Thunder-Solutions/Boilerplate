import { GraphQLScalarType, Kind } from 'graphql'

export const Date = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom scalar Date type',
  serialize(value) {
    return value.toISOString()
  },
  parseValue(value) {
    return value // let the code determine how the ISO string is parsed
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)).toISOString() // Convert hard-coded AST string to integer and then to ISO string
    }
    return null // Invalid hard-coded value (not an integer)
  },
})

export const ScalarDate = 'scalar Date'
