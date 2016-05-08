var authMiddleware = require('./middlewares/authentication');
var AutoLoader = require('./autoLoader');
var Configuration = require('./configuration');

function Acl() {
  this.autoLoader = null;
  this.configuration = null;
}

Acl.prototype.use = function(bookshelf) {
  if (this.autoLoader === null) {
    AutoLoader.init(bookshelf);
    this.autoLoader = AutoLoader;
  }
}
Acl.prototype.init = function(options) {
  if (this.configuration === null) {
    Configuration.init(options);
    this.configuration = Configuration;
  }
}
Acl.prototype.getModel = function(name) {
  return this.autoLoader.getModel(name);
}
Acl.prototype.getBookshelf = function() {
  return this.autoLoader.getBookshelf();
}
Acl.prototype.getConfig = function() {
  return this.configuration.getParams();
}

//Expose oauth2orize functions
Acl.prototype.isAuthenticated = authMiddleware.isAuthenticated;
Acl.prototype.isClientAuthenticated = authMiddleware.isClientAuthenticated;

//exports = module.exports = Acl;
exports = module.exports = new Acl;
