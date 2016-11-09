var knex = require('knex')({
  client: 'mariasql',
	connection: {
			host: '127.0.0.1',
			user: 'root',
			password: 'root',
			db: 'c4cdb'
	},
	useNullAsDefault: true
});
var Bookshelf = require('bookshelf')(knex);
var ideman = require('ideman')(Bookshelf, {prefix: 'idm_'});

ideman.init({
  token: {
    autoRemove: true
  },
  validation: {
    enabled: false
  }
});

module.exports = ideman;
