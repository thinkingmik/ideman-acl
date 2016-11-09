exports = module.exports = function(bookshelf, dbConfig, idemanDbConfig) {
  var Role = bookshelf.Model.extend({
    tableName: dbConfig.prefix + dbConfig.entities.role.table,
		hasTimestamps: ['createdAt', 'updatedAt'],
    usersRoles: function() {
      return this.hasMany(dbConfig.entities.userRole.model, 'roleId');
    },
    policies: function() {
      return this.hasMany(dbConfig.entities.policy.model, 'roleId');
    }
  });

  return bookshelf.model(dbConfig.entities.role.model, Role);
}
