const pool = require('../../db');

module.exports = {
  get: (req, res) => {
    const queryString = 'SELECT * FROM rooms'

    pool.query(queryString)
      .then((results) => {
        res.status(200).send(results);
      })
      .catch((err) => {
        res.status(404).send(err);
      })
  }
}