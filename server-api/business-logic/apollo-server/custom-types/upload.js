import { GraphQLError, GraphQLScalarType } from 'graphql';

export const ScalarUpload = 'scalar Upload';

export const Upload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    throw new GraphQLError('Upload literal unsupported.', ast);
  },
  serialize() {
    throw new GraphQLError('Upload serialization unsupported.');
  },
});
