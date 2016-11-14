exports = module.exports = function(ideman, dbConfig) {
	var bookshelf = ideman.getBookshelf();
	var idemanDbConfig = ideman.getDbConfig();
	
  var Resource = bookshelf.Model.extend({
    tableName: dbConfig.prefix + dbConfig.entities.resource.table,
		hasTimestamps: ['createdAt', 'updatedAt'],
    policies: function() {
      return this.hasMany(dbConfig.entities.policy.model, 'resourceId');
    }
  });

  return bookshelf.model(dbConfig.entities.resource.model, Resource);
}
