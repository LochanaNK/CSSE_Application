import express from 'express';

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Define a simple route
app.get('/', (req, res) => {
  res.status(200).send('Hello, World!\n');
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`🚀 Server running at http://${hostname}:${port}/`);
});
