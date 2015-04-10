var debug = require('../../node_modules/loopback/node_modules/debug')('aclmod:Project');
var util = require('util');
var assert = require('assert');

module.exports = function(Project) {


  Project.afterRemote('create', function(context, project, next) {
    var Team = Project.app.models.Team;
    var AccessManager = Project.app.models.AccessManager;
    assert(context.req.accessToken, 'Projects may only be created by authenticated users');

    var accessToken = context.req.accessToken;
    debug('afterRemote(create) Creating project: ' + util.inspect(project) + ', accessToken: ' + util.inspect(accessToken));

    // Add the user to the team
    Team.create({projectId: project.id, userId: accessToken.userId}, function(err, team) {
      debug('afterRemote(create) Creating team: ' + util.inspect(team) + ', err: ' + util.inspect(err));

      AccessManager.manageInstance(AccessManager.ADMIN,
                                   'Project',
                                   project.id,
                                   accessToken.userId, 
                                   function(err, am) {
        debug('afterRemote(create) Managing instance. am: ' + util.inspect(am) + ', err: ' + util.inspect(err), ', calling next()');
        next();
      });
    });
  });
};

