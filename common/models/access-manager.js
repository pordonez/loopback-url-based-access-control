var debug = require('../../node_modules/loopback/node_modules/debug')('aclmod:AccessManager');
var util = require('util');

module.exports = function(AccessManager) {

  AccessManager.ADMIN = 'admin';
  AccessManager.READER = 'reader';
  AccessManager.WRITER = 'writer';

  AccessManager.manageBaseUrl = function(roleType, 
                                         modelName,
                                         baseUrl,
                                         instId,
                                         userId,
                                         callback) {
    var Role = AccessManager.app.models.Role;
    var RoleMapping = AccessManager.app.models.RoleMapping;
    var ACL = AccessManager.app.models.ACL;

    //create the admin role
    var roleName = roleType + ':' + baseUrl + '/' + instId
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
/*
        ACL.create({model: modelName,
                    principalType: ACL.ROLE, 
                    principalId: role.name,
                    property: 'findById',
                    accessType: "READ", 
                    permission: ACL.ALLOW}, function(err, acl) {
          debug('manageInstance() Creating ACL: ' + util.inspect(acl) + ', err: ' + util.inspect(err));
          if (err)  {
            if (callback) callback(err); else throw err;
          }
*/
          AccessManager.create({instId: instId,
                                baseUrl: baseUrl,
                                roleType: roleType, 
//                                aclId: acl.id, 
                                aclId: 0, 
                                userId: userId}, function(err, am) {
            debug('manageInstance() Creating AccessManager: ' + util.inspect(am) + ', err: ' + util.inspect(err));
            if (callback) callback(err, am); else throw err;
          });
//        });
      });
    });
  };

  AccessManager.resolver = function(role, context, cb) {
    debug('resolver() Resolving role: ' + util.inspect(role));
    process.nextTick(function() {
      var allowed = true;

      debug('resolver() nextTick() role: ' + util.inspect(role) + 
            ', principals: ' + util.inspect(context.principals) +
            ', modelName: ' + context.modelName + 
            ', modelId: ' + context.modelId + 
            ', originalUrl: ' + context.remotingContext.req.originalUrl + 
            ', allowed: ' + allowed);

      if (cb) cb(null, allowed);
    });
  }
};
