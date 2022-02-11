const router = require('express').Router();
const controllers = require('./controllers');

router.route('/meetings/:roomId')
  .get(controllers.meetings.get)

router.route('/meetings')
  .post(controllers.meetings.post)

router.route('/meetings/:id')
  .delete(controllers.meetings.delete)

router.route('/rooms')
  .get(controllers.rooms.get)

router.route('/customers')
  .get(controllers.customers.get)

  module.exports = router;