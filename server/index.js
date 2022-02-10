const express = require ('express');
const cors = require('cors');
const routes = require('./routes');
const pool = require('../db');
const morgan = require('morgan');

const app = express()
const PORT = 3000;

pool.connect((err) => {
  if (err) console.error('db error', err);
  else console.log('Database connected');
});

app.use(cors());
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/../client/dist'));
app.use(morgan('dev'))
app.use(express.json())

app.use('/', routes)

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
});