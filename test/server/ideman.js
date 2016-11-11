var knex = require('knex')({
  client: 'pg',
  connection: 'postgres://postgres:postgres@pandora.net/ideman?charset=utf-8',
});
var Bookshelf = require('bookshelf')(knex);
var ideman = require('ideman')(Bookshelf, { prefix: 'idm_' });

ideman.init({
  token: {
    autoRemove: true
  },
  user: {
    passwordEnc: 'crypto'
  },
  validation: {
    enabled: false
  }
});

module.exports = ideman;
