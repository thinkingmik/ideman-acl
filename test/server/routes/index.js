var express = require('express');
var router = express.Router();
var ideman = require('../ideman');
var idemanAcl = require('../idemanAcl');

router.route('/oauth2/authorize')
  .get(ideman.isAuthenticated, ideman.authorization)
  .post(ideman.isAuthenticated, ideman.decision);

router.route('/oauth2/token')
  .post(ideman.isClientAuthenticated, ideman.token);

router.route('/oauth2/logout')
  .post(ideman.isAuthenticated, ideman.logout);

router.route('/resource').get(ideman.isAuthenticated, idemanAcl.isAllowed('test'), function(req, res) {
  res.json(true);
});

module.exports = router;
