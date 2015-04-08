var loopback  = require('../../node_modules/loopback/index');
var Role = loopback.Role;
var RoleMapping = loopback.RoleMapping;
var debug = require('../../node_modules/loopback/node_modules/debug')('aclmod:Project');
var util = require('util');
var assert = require('assert');

module.exports = function(Project) {

  Project.afterRemote('create', function(context, project) {
    assert(context.req.accessToken, 'Projects may only be created by authenticated users');

    var accessToken = context.req.accessToken;
    debug("project: " + util.inspect(project) + ", accessToken: " + util.inspect(accessToken));

    var userId = accessToken.userId
    var rolePrefix = userId + "_" +project.name + "_";

    Role.create({name: rolePrefix+'_admin'}, function(err, role) {
      debug("role: " + util.inspect(role) + ", err: " + util.inspect(err));
      if (err) throw err;
      role.principals.create({principalType: RoleMapping.USER, principalId: userId}, function(err, p) {
        debug("role mapping: " + util.inspect(p) + ", err: " + util.inspect(err));
        if (err) throw err;
      });
    });

    Role.create({name: rolePrefix+'_editor'}, function(err, role) {
      debug("role: " + util.inspect(role) + ", err: " + util.inspect(err));
      if (err) throw err;
    });

    Role.create({name: rolePrefix+'_viewer'}, function(err, role) {
      debug("role: " + util.inspect(role) + ", err: " + util.inspect(err));
      if (err) throw err;
    });
  });
};

