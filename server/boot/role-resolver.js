var debug = require('../../node_modules/loopback/node_modules/debug')('aclmod:AccessManager');
var util = require('util');

module.exports = function(app) {
  var Role = app.models.Role;
  var AccessManager = app.models.AccessManager;
  debug('Registering accessManager role resolver');
  Role.registerResolver('accessManager', AccessManager.resolver);
}
