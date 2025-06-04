const express = require('express');
const app = express();
app.use(express.json());

let messages = [];

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  messages.push(req.body);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on port 3000'));
