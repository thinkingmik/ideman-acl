exports = module.exports = function(ideman, dbConfig) {
	var bookshelf = ideman.getBookshelf();
	var idemanDbConfig = ideman.getDbConfig();
	
  var Permission = bookshelf.Model.extend({
    tableName: dbConfig.prefix + dbConfig.entities.permission.table,
		hasTimestamps: ['createdAt', 'updatedAt'],
    policies: function() {
      return this.hasMany(dbConfig.entities.policy.model, 'permissionId');
    }
  });

  return bookshelf.model(dbConfig.entities.permission.model, Permission);
}
