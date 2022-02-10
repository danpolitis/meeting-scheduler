const pool = require('../../db');

module.exports = {
  get: (req, res) => {
    params = [req.params.roomId];
    console.log(params)
    const queryString = 'SELECT * FROM meetings WHERE room = $1'

    pool.query(queryString, params)
      .then((results) => {
        res.status(200).send(results.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },

  post: (req, res) => {

    params = [req.body.text, req.body.allDay, req.body.startDate, req.body.endDate, req.body.price, req.body.description, req.body.hoursUsed, req.body.creditsUsed, req.body.room];

    console.log(params)

    const queryString = 'INSERT INTO meetings (customer, "allDay", "startDate", "endDate", price, description, "hoursUsed", "creditsUsed", room) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';

    pool.query(queryString, params)
      .then((results) => {
        res.status(201).send(results)
      })
      .catch((err) => {
        res.status(400).send(err);
      })
  }
}