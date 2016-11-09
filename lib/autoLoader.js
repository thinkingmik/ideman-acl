function AutoLoader() {
  this._models = {};
	this._idemanDbConfig = {};
	this._idemanModels = {};
}

AutoLoader.prototype.init = function(ideman, dbConfig) {
  var models = {};
  for (var key in dbConfig.entities) {
    var entity = dbConfig.entities[key];
    var modelFunc = require('./models/' + entity.file);
    var model = modelFunc(ideman.getBookshelf(), dbConfig, ideman.getDbConfig());
    models[entity.model] = model;
  }
  this._models = models;
	this._idemanModels = ideman.getModels();
	this._idemanDbConfig = ideman.getDbConfig();
}

AutoLoader.prototype.getModels = function() {
  return this._models;
}

AutoLoader.prototype.getModel = function(name) {
  return this._models[name] || null;
}

AutoLoader.prototype.getIdemanModel = function(name) {
  return this._idemanModels[name] || null;
}

AutoLoader.prototype.getIdemanDbConfig = function() {
  return this._idemanDbConfig;
}

exports = module.exports = new AutoLoader;
