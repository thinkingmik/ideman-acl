var AutoLoader = require('../autoLoader');

exports = module.exports = function(ideman, dbConfig) {
	var bookshelf = ideman.getBookshelf();
	var idemanDbConfig = ideman.getDbConfig();
	
  var UserBase = ideman.getModel(idemanDbConfig.entities.user.model);
	
	var User = UserBase.extend({
    usersRoles: function() {
      return this.hasMany(dbConfig.entities.userRole.model, 'userId');
    },
		policies: function() {
      return this.hasMany(dbConfig.entities.policy.model, 'userId');
    }
  });
	
  return User;
}
