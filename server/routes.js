const router = require('express').Router();
const controllers = require('./controllers');

router.route('/meetings/:roomId')
  .get(controllers.meetings.get)

router.route('/meetings')
  .post(controllers.meetings.post)

  module.exports = router;