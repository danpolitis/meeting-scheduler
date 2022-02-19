const pool = require('../../db');

module.exports = {
  get: (req, res) => {
    const queryString = 'SELECT * FROM date'

    pool.query(queryString)
      .then((results) => {
        res.status(200).send(results.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      })
  },

  put: (req, res) => {
    let params = [req.body.month]

    const queryString = 'UPDATE date SET month = $1 WHERE id = 1'

    pool.query(queryString, params)
      .then((results) => {
        res.status(202).send(results.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      })
  }
}