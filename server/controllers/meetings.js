const pool = require('../../db');

module.exports = {
  get: (req, res) => {
    params = [req.body.room_id];
    const queryString = 'SELECT * FROM meetings WHERE room_id = $1'

    pool.query(queryString, params)
      .then((results) => {
        res.status(200).send(results);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },

  post: (req, res) => {
    params = [req.body.text, req.body.allDay, req.body.startDate, req.body.endDate, req.body.price, req.body.description, req.body.hoursUsed, req.body.creditsUsed];

    const queryString = 'INSERT INTO meetings (customer, all_day, start_date, end_date, price, description, hours_used, credits_used) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';

    pool.query(queryString, params)
      .then((results) => {
        res.status(201).send(results)
      })
      .catch((err) => {
        res.status(400).send(err);
      })
  }
}