const pool = require('../../db');

module.exports = {
  get: (req, res) => {
    params=[Number(req.params.roomId)]

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

    const queryString = 'INSERT INTO meetings (text, "allDay", "startDate", "endDate", price, description, "hoursUsed", "creditsUsed", "roomId") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';

    pool.query(queryString, params)
      .then((results) => {
        let updateParams = [results.rows[0].text, results.rows[0].price, results.rows[0].hoursUsed, results.rows[0].creditsUsed]
        const updateQuery = 'UPDATE customers SET outstanding_balance = outstanding_balance + $2, free_hours = free_hours - $3, credit = credit - $4 WHERE name = $1'
        pool.query(updateQuery, updateParams)
          .then((results) => {
            console.log('Customer Data Updated')
          })
          .catch((err) => {
            console.log(err)
          })
        res.send(results).status(201);
      })
      .catch((err) => {
        res.sendStatus(400);
      })
  },

  delete: (req, res) => {
    params = [req.params.id]
    const queryString = 'DELETE FROM meetings WHERE id=$1 RETURNING *'

    pool.query(queryString, params)
      .then((results) => {
        let updateParams = [results.rows[0].text, results.rows[0].price, results.rows[0].hoursUsed, results.rows[0].creditsUsed]
        const updateQuery = 'UPDATE customers SET outstanding_balance = outstanding_balance - $2, free_hours = free_hours + $3, credit = credit + $4 WHERE name = $1'
        pool.query(updateQuery, updateParams)
          .then((results) => {
            console.log('Customer Data Updated')
          })
          .catch((err) => {
            console.log(err)
          })
        res.sendStatus(202)
      })
      .catch((err) => {
        res.sendStatus(404)
      })
  }
}