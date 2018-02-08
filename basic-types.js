const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollTheDice: [Int]
  }
`);

const root = {
  quoteOfTheDay: () =>
    Math.random() < 0.5 ? 'Take it easy!' : 'Salvation lies within',
  random: () => Math.random(),
  rollTheDice: () => [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 6)),
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
