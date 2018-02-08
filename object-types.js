const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const schema = buildSchema(`
  type RandomDie {
    numSides: Int!,
    rollOnce: Int!,
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`);

const RandomDie = numSides => ({
  rollOnce() {
    return 1 + Math.floor(Math.random() * numSides);
  },
  roll({ numRolls }) {
    return Array(numRolls)
      .fill()
      .map(() => this.rollOnce());
  },
});

const root = {
  getDie: ({ numSides }) => RandomDie(numSides || 6),
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
