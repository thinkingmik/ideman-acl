exports = module.exports = function(ideman, dbConfig) {
	var bookshelf = ideman.getBookshelf();
	var idemanDbConfig = ideman.getDbConfig();

	var UserRole = bookshelf.Model.extend({
		tableName: dbConfig.prefix + dbConfig.entities.userRole.table,
		hasTimestamps: ['createdAt', 'updatedAt'],
		user: function() {
			return this.belongsTo(idemanDbConfig.entities.user.model, 'userId');
		},
		role: function() {
			return this.belongsTo(dbConfig.entities.role.model, 'roleId');
		}
	});

	return bookshelf.model(dbConfig.entities.userRole.model, UserRole);
}
