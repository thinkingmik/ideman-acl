var ideman = require('./ideman');
var idemanAcl = require('../../')(ideman, { prefix: 'idm_' });


module.exports = idemanAcl;
