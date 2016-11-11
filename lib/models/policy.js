var Promise = require('bluebird');
var Moment = require('moment');
var _ = require('lodash');
var AutoLoader = require('../autoLoader');

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
    fetchActivesByUserId: function(userId) {
      var Resource = AutoLoader.getModel(dbConfig.entities.resource.model);
      var Permission = AutoLoader.getModel(dbConfig.entities.permission.model);

      var resourcesTable = dbConfig.prefix + dbConfig.entities.resource.table;
      var permissionsTable = dbConfig.prefix + dbConfig.entities.permission.table;
      var rolesTable = dbConfig.prefix + dbConfig.entities.role.table;
      var usersRolesTable = dbConfig.prefix + dbConfig.entities.userRole.table;
      var policiesTable = dbConfig.prefix + dbConfig.entities.policy.table;

      return new Promise(function(resolve, reject) {
        var nowdate = Moment().format();
        var columns = [
            policiesTable + '.id',
            policiesTable + '.userId',
            policiesTable + '.activation',
            policiesTable + '.expiration',
            policiesTable + '.createdAt',
            policiesTable + '.updatedAt',
            rolesTable + '.id as roleId',
            resourcesTable + '.id as resourceId',
            resourcesTable + '.name as resourceName',
            permissionsTable + '.id as permissionId',
            permissionsTable + '.name as permissionName'
        ];

        return bookshelf.knex.select(columns)
        .from(policiesTable)
        .leftJoin(usersRolesTable, usersRolesTable + '.roleId', policiesTable + '.roleId')
        .leftJoin(rolesTable, rolesTable + '.id', usersRolesTable + '.roleId')
        .leftJoin(resourcesTable, resourcesTable + '.id', policiesTable + '.resourceId')
        .leftJoin(permissionsTable, permissionsTable + '.id', policiesTable + '.permissionId')
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
            var policy = Policy.forge({
              id: raw.id,
              userId: raw.userId,
              roleId: raw.roleId,
              resourceId: raw.resourceId,
              permissionId: raw.permissionId,
              activation: raw.activation,
              expiration: raw.expiration,
              createdAt: raw.createdAt,
              updatedAt: raw.updatedAt
            });

            var resource = Resource.forge({
              id: raw.resourceId,
              name: raw.resourceName
            });
            policy.set('resource', resource);

            var permission = Permission.forge({
              id: raw.permissionId,
              name: raw.permissionName
            });
            policy.set('permission', permission);

            policies.push(policy);
          }
          
          return resolve(policies);
        })
        .catch(function(err) {
          return reject(err);
        })
      });
    }
  });

  return bookshelf.model(dbConfig.entities.policy.model, Policy);
}
