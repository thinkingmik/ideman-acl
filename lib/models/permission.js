exports = module.exports = function(bookshelf, dbConfig, idemanDbConfig) {
  var Permission = bookshelf.Model.extend({
    tableName: dbConfig.prefix + dbConfig.entities.permission.table,
		hasTimestamps: ['createdAt', 'updatedAt'],
    policies: function() {
      return this.hasMany(dbConfig.entities.policy.model, 'permissionId');
    }
  });

  return bookshelf.model(dbConfig.entities.permission.model, Permission);
}
