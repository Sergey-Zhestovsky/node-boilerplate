const Controller = require('./Controller');

const rbac = new Controller();
rbac.initialize();

module.exports = rbac;

console.log(rbac.root.inherits[0].contain('USER'));
