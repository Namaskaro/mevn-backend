const router = require('express-promise-router')();

const { payment } = require('../controllers');

router.route('/').post(payment.createPaymentIntent);
router.route('/stripe').post(payment.stripeWebHook)
module.exports = router;
