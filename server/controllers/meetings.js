const pool = require('../../db');

module.exports = {
  get: (req, res) => {
    params=[Number(req.params.roomId)]
    console.log(params)

    const queryString = 'SELECT * FROM meetings WHERE "roomId" = $1'

    pool.query(queryString, params)
      .then((results) => {
        res.status(200).send(results.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
        console.log(err)
      });
  },

  post: (req, res) => {
    params = [req.body.text, req.body.allDay, req.body.startDate, req.body.endDate, req.body.price, req.body.description, req.body.hoursUsed, req.body.creditsUsed, req.body.roomId];
    console.log(params)

    const queryString = 'INSERT INTO meetings (text, "allDay", "startDate", "endDate", price, description, "hoursUsed", "creditsUsed", "roomId") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';

    pool.query(queryString, params)
      .then((results) => {
        res.status(201).send(results)
      })
      .catch((err) => {
        res.status(400).send(err);
      })
  },

  delete: (req, res) => {
    params = [req.params.id]
    const queryString = 'DELETE FROM meetings WHERE id=$1'

    pool.query(queryString, params)
      .then((results) => {
        res.status(202).send(results)
      })
      .catch((err) => {
        res.status(404).send(results)
      })
  }
}