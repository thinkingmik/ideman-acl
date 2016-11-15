var Promise = require('bluebird');
var AutoLoader = require('../autoLoader');
var db = require('../database').getParams();
var NotFoundError = require('../exceptions/notFoundError');
var AclNotFoundError = require('../exceptions/aclNotFoundError');
var headerHelper = require('../utils/headerParser');

var isAllowed = function(resource, permission) {
  return function(req, res, callback) {
    var id = null;

    if (!permission) {
      permission = req.method;
    }

    return getUserId(req)
    .bind({})
    .then(function(userId) {
      id = userId;
      return AutoLoader.getModel(db.entities.policy.model).forge().fetchActivesByUserId(userId);
    })
    .then(function(policies) {
      for (var key in policies) {
        var policy = policies[key];
        if (policy.get('resource').get('name').toLowerCase() === resource.toLowerCase() && policy.get('permission').get('name').toLowerCase() === permission.toLowerCase()) {
          return true;
        }
      }
      return false;
    })
    .then(function(ret) {
      if (ret === false) {
        var message = 'Unable to find a policy for userId=' + id + ' over resource=' + resource.toLowerCase() + ' with permission=' + permission.toLowerCase();
        throw new AclNotFoundError(message);
      }
      return ret;
    })
    .nodeify(function(err, ret) {
      if (err) {
        return callback(err);
      }
      else {
        return callback(null, ret);
      }
    });
  }
}

var getUserId = function(req) {
  var promise = Promise.resolve();
  var idemanDbConfig = AutoLoader.getIdemanDbConfig();
  var user = null;
  var bearerToken = null;
  var credentials = headerHelper.getBasicAuthentication(req);

  if (credentials == null) {
    bearerToken = headerHelper.getBearerToken(req);

    promise = AutoLoader.getIdemanModel(idemanDbConfig.entities.token.model).forge()
    .where({
      token: bearerToken
    })
    .fetch({
      columns: ['userId']
    })
    .then(function(token) {
      if (!token) {
        throw new NotFoundError();
      }
      return Promise.resolve(token.get('userId'));
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
  }
  else {
    promise = AutoLoader.getModel(idemanDbConfig.entities.user.model).forge()
    .where({
      username: credentials['username'],
      enabled: true
    })
    .fetch({
      columns: ['id', 'password']
    })
    .bind({})
    .then(function(user) {
      this.user = user;
      if (!user) {
        throw new NotFoundError();
      }
      return user.verifyPassword(credentials['password']);
    })
    .then(function(isMatch) {
      if (!isMatch) {
        throw new NotFoundError();
      }
      return Promise.resolve(this.user.get('id'));
    })
    .catch(function(err) {
      return Promise.reject(err);
    });
  }

  return promise;
}

exports.isAllowed = isAllowed;
