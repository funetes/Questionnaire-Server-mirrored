const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
require('./models');

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
