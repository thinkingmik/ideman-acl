var Promise = require('bluebird');
var Moment = require('moment');

exports = module.exports = function(bookshelf, dbConfig, idemanDbConfig) {
  var Policy = bookshelf.Model.extend({
    tableName: dbConfig.prefix + dbConfig.entities.policy.table,
		user: function() {
      return this.belongsTo(idemanDbConfig.entities.user.model, 'userId');
    },
    role: function() {
      return this.belongsTo(dbConfig.entities.role.model, 'roleId');
    },
    resource: function() {
      return this.belongsTo(dbConfig.entities.resource.model, 'resourceId');
    },
    permission: function() {
      return this.belongsTo(dbConfig.entities.permission.model, 'permissionId');
    },
		fetchAllByUserId: function(userId) {
			var rolesTable = dbConfig.prefix + dbConfig.entities.role.table;
      var usersRolesTable = dbConfig.prefix + dbConfig.entities.userRole.table;
      var policiesTable = dbConfig.prefix + dbConfig.entities.policy.table;
			
      return new Promise(function(resolve, reject) {
        var nowdate = Moment().format();
        bookshelf.knex.select(policiesTable + '.*')
        .from(policiesTable)
        .leftJoin(usersRolesTable, usersRolesTable + '.roleId', policiesTable + '.roleId')
        .leftJoin(rolesTable, rolesTable + '.id', usersRolesTable + '.roleId')
        .where(function() {
        	this.where(policiesTable + '.userId', '=', userId).orWhere(function() {
            this.where(usersRolesTable + '.userId', '=', userId).andWhere(rolesTable + '.enabled', '=', true);
          })
        })
        .andWhere(function() {
          this.whereNull(usersRolesTable + '.activation').orWhere(usersRolesTable + '.activation', '<=', nowdate);
        })
        .andWhere(function() {
        	this.whereNull(usersRolesTable + '.expiration').orWhere(usersRolesTable + '.expiration', '>', nowdate);
        })
        .andWhere(function() {
        	this.whereNull(policiesTable + '.activation').orWhere(policiesTable + '.activation', '<=', nowdate);
        })
        .andWhere(function() {
        	this.whereNull(policiesTable + '.expiration').orWhere(policiesTable + '.expiration', '>', nowdate);
        })
        .then(function(res) {
          var policies = [];
          for (var key in res) {
            var raw = res[key];
            var policy = Policy.forge(raw);
            policies.push(policy);
          }
          resolve(policies);
        })
        .catch(function(err) {
          reject(err);
        })
      });
		}
  });

  return bookshelf.model(dbConfig.entities.policy.model, Policy);
}
