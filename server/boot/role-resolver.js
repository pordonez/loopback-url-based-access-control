var debug = require('../../node_modules/loopback/node_modules/debug')('aclmod:BootRegisterResolver');
var util = require('util');

module.exports = function(app) {
  var Role = app.models.Role;
  var AccessRule = app.models.AccessRule;
  debug('Registering accessManager role resolver');
  Role.registerResolver('accessManager', AccessRule.resolver);
}
