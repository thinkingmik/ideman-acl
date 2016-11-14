exports = module.exports = function(ideman, dbConfig) {
	var bookshelf = ideman.getBookshelf();
	var idemanDbConfig = ideman.getDbConfig();
	
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
