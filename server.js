const express = require('express');
// const { buildSchema } = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const fakeDatabase = {
  a: {
    id: 'a',
    name: 'alice',
  },
  b: {
    id: 'b',
    name: 'bob',
  },
};

const app = express();

// const schema = buildSchema(`
//   type User {
//     id: String
//     name: String
//   }

//   type Query {
//     user(id: String): User
//   }
// `);

// const root = {
//   user: ({ id }) => fakeDatabase[id],
// };

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     rootValue: root,
//     graphiql: true,
//   })
// );

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (root, { id }) => {
        console.log(root);
        return fakeDatabase[id];
      },
    },
  },
});

const schema = new GraphQLSchema({ query: queryType });

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');
