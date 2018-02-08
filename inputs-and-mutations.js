const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const { randomBytes } = require('crypto');

/** Input types can't have fields that are other objects,
 * only basic scalar types, list types, and other input types.
 *
 * @see { @link http://graphql.org/graphql-js/mutations-and-input-types/ }
 */

const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

const fakeDatabase = {
  '1239123af': {
    content: 'foo',
    author: 'bar',
  },
};

const messageFactory = (id, { content, author }) => ({ id, content, author });

const root = {
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`No message with ID '${id}'`);
    }

    return messageFactory(id, fakeDatabase[id]);
  },
  createMessage: ({ input }) => {
    const id = randomBytes(10).toString('hex');

    fakeDatabase[id] = input;
    return messageFactory(id, input);
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`No message with ID '${id}'`);
    }

    fakeDatabase[id] = Object.assign({}, fakeDatabase[id], input);
    return messageFactory(id, fakeDatabase[id]);
  },
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');
