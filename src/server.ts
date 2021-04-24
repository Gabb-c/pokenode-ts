import express from 'express';

const app = express();

app.use('/', (request, response) => {
  response.json({ message: 'Hello World !' });
});

app.listen(3333);
