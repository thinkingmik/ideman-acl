var config = require('./config');

function Configuration() {
  this.config = {};
}
Configuration.prototype.init = function(options) {
  if (options === null || options === {}) {
    return;
  }
}
Configuration.prototype.getParams = function() {
  return this.config;
}

exports = module.exports = new Configuration;
