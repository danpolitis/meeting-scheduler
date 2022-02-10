const router = require('express').Router();
const controllers = require('./controllers');

router.route('/meetings')
  .get(controllers.meetings.get)
  .post(controllers.meetings.post)

  module.exports = router;