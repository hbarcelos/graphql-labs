const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

const root = {
  rollDice: ({ numDice, numSides = 6 }) =>
    Array(numDice)
      .fill()
      .map(() => 1 + Math.floor(Math.random() * numSides)),
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
