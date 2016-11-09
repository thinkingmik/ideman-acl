var AutoLoader = require('./autoLoader');
var Database = require('./database');
var aclMiddleware = require('./middlewares/acl');

function IdentityManagerAcl(ideman, dbConfig) {
  if (dbConfig) {
    Database.init(dbConfig);
  }
  if (ideman) {
    AutoLoader.init(ideman, Database.getParams());
  }
}

IdentityManagerAcl.prototype.getModel = function(name) {
  return AutoLoader.getModel(name);
}

IdentityManagerAcl.prototype.getModels = function() {
  return AutoLoader.getModels();
}

//Expose acl middleware function
IdentityManagerAcl.prototype.isAllowed = aclMiddleware.isAllowed;

exports = module.exports = function(ideman, dbConfig) {
  return new IdentityManagerAcl(ideman, dbConfig);
}
