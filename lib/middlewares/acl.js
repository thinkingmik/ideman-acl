var Promise = require('bluebird');
var AutoLoader = require('../autoLoader');
var db = require('../database').getParams();
var NotFoundError = require('../exceptions/notFoundError');
var AclNotFoundError = require('../exceptions/aclNotFoundError');
var headerHelper = require('../utils/headerParser');

var isAllowed = function(resource, permission) {
  return function(req, res, callback) {
    if (!permission) {
      permission = req.method;
    }
		
    getUserId(req)
    .then(function(userId) {
      if (!userId) {
        throw new AclNotFoundError();
      }
      return AutoLoader.getModel(db.entities.policy.model).forge().fetchAllByUserId(userId);
    })
    .then(function(policies) {
      for (var key in policies) {
        var policy = policies[key];
        if (policy.get('resourceId').toLowerCase() === resource.toLowerCase() && policy.get('permissionId').toLowerCase() === permission.toLowerCase()) {
          
					return callback(null, true);
        }
      }
      throw new AclNotFoundError();
    })
    .catch(function(err) {
      return callback(err);
    });
  }
}

var getUserId = function(req) {
	var idemanDbConfig = AutoLoader.getIdemanDbConfig();
  var user = null;
  var bearerToken = null;
  var credentials = headerHelper.getBasicAuthentication(req);

  return new Promise(function(resolve, reject) {
    if (credentials == null) {
      bearerToken = headerHelper.getBearerToken(req);
      AutoLoader.getIdemanModel(idemanDbConfig.entities.token.model).forge()
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
        return resolve(token.get('userId'));
      })
      .catch(function(err) {
        return reject(err);
      });
    }
    else {
      AutoLoader.getModel('User').forge()
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
        return resolve(this.user.get('id'));
      })
      .catch(function(err) {
        return reject(err);
      });
    }
  });
}

exports.isAllowed = isAllowed;
