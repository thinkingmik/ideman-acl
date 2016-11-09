exports = module.exports = function(bookshelf, dbConfig, idemanDbConfig) {
  var Resource = bookshelf.Model.extend({
    tableName: dbConfig.prefix + dbConfig.entities.resource.table,
		hasTimestamps: ['createdAt', 'updatedAt'],
    policies: function() {
      return this.hasMany(dbConfig.entities.policy.model, 'resourceId');
    }
  });

  return bookshelf.model(dbConfig.entities.resource.model, Resource);
}
