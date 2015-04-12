var debug = require('../../node_modules/loopback/node_modules/debug')('aclmod:AccessManager');
var util = require('util');

module.exports = function(AccessManager) {

  AccessManager.ADMIN = 'admin';
  AccessManager.READER = 'reader';
  AccessManager.WRITER = 'writer';

  AccessManager.manageUrl = function(roleType, 
                                     baseUrl,
                                     userId,
                                     callback) {
    var Role = AccessManager.app.models.Role;
    var RoleMapping = AccessManager.app.models.RoleMapping;
    var ACL = AccessManager.app.models.ACL;

    //create the admin role
    var roleName = roleType + ':' + baseUrl; 
    Role.create({name: roleName}, function(err, role) {
      debug('createModelRole() Creating Role: ' + util.inspect(role) + ', err: ' + err);
      if (err)  {
        if (callback) callback(err); else throw err;
      }

      // make the logged in user an admin
      role.principals.create({principalType: RoleMapping.USER, principalId: userId}, 
        function(err, roleMapping) {
        debug('manageInstance() Creating RoleMapping: ' + util.inspect(roleMapping) + ', err: ' + util.inspect(err));
        if (err)  {
          if (callback) callback(err); else throw err;
        }
        AccessManager.create({baseUrl: baseUrl,
                              roleType: roleType, 
                              userId: userId}, function(err, am) {
          debug('manageInstance() Creating AccessManager: ' + util.inspect(am) + ', err: ' + util.inspect(err));
          if (callback) callback(err, am); else throw err;
        });
      });
    });
  };

  AccessManager.resolver = function(role, context, cb) {
    debug('resolver() Resolving role: ' + util.inspect(role));
    process.nextTick(function() {

      function reject() {
        process.nextTick(function() {
          debug('resolver() nextTick() role: ' + util.inspect(role) + 
                ', principals: ' + util.inspect(context.principals) +
                ', originalUrl: ' + context.remotingContext.req.originalUrl +
                ', allowed: false');
          if (cb) cb(null, false);
        });
      }
      var principals = context.principals;
      if (!principals || !principals[0] || !principals[0].id) 
        return reject();

      AccessManager.find({where: {and: 
        [{userId: principals[0].id}]}},
        function(err, rules) {
          var allowed = true;
          debug('resolver() nextTick() For id: ' + principals[0].id + ' found access manager rules: ' + util.inspect(rules));
          debug('resolver() nextTick() role: ' + util.inspect(role) + 
                ', principals: ' + util.inspect(context.principals) +
                ', originalUrl: ' + context.remotingContext.req.originalUrl + 
                ', allowed: ' + allowed);

          if (cb) cb(null, allowed);
      });
    });
  }
};
