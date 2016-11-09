var settings = require('./db');

function Database() {
  this._config = settings;
}

Database.prototype.init = function(options) {
  if (options === null || options === {}) {
    return;
  }
  if (options.prefix) {
    this._config.prefix = options.prefix || '';
  }
  if (options.entities && options.entities.role) {
    this._config.entities.role['table'] = options.entities.role['table'] || this._config.entities.role['table'];
    this._config.entities.role['model'] = options.entities.role['model'] || this._config.entities.role['model'];
  }
  if (options.entities && options.entities.userRole) {
    this._config.entities.userRole['table'] = options.entities.userRole['table'] || this._config.entities.userRole['table'];
    this._config.entities.userRole['model'] = options.entities.userRole['model'] || this._config.entities.userRole['model'];
  }
  if (options.entities && options.entities.resource) {
    this._config.entities.resource['table'] = options.entities.resource['table'] || this._config.entities.resource['table'];
    this._config.entities.resource['model'] = options.entities.resource['model'] || this._config.entities.resource['model'];
  }
  if (options.entities && options.entities.pemission) {
    this._config.entities.pemission['table'] = options.entities.pemission['table'] || this._config.entities.pemission['table'];
    this._config.entities.pemission['model'] = options.entities.pemission['model'] || this._config.entities.pemission['model'];
  }
	if (options.entities && options.entities.policy) {
    this._config.entities.policy['table'] = options.entities.policy['table'] || this._config.entities.policy['table'];
    this._config.entities.policy['model'] = options.entities.policy['model'] || this._config.entities.policy['model'];
  }
}

Database.prototype.getParams = function() {
  return this._config;
}

exports = module.exports = new Database;
