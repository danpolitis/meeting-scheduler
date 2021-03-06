const pool = require('../../db');

module.exports = {
  get: (req, res) => {
    const queryString = 'SELECT * FROM customers'

    pool.query(queryString)
      .then((results) => {
        res.status(200).send(results.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      })
  },

  put: (req, res) => {
    const queryString = 'UPDATE customers SET credit = 50, free_hours = 5 WHERE id = 1'

    pool.query(queryString)
      .then((results) => {
        res.status(202).send(results.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      })
  }
}