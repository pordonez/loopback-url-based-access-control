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

    AccessManager.create({baseUrl: baseUrl,
                          roleType: roleType, 
                          userId: userId}, function(err, am) {
      debug('manageUrl() Creating AccessManager: ' + util.inspect(am) + ', err: ' + util.inspect(err));
      if (callback) callback(err, am); else throw err;
    });
  };

  AccessManager.resolver = function(role, context, cb) {
    debug('resolver() Resolving role: ' + util.inspect(role));
    process.nextTick(function() {

      function reject() {
        process.nextTick(function() {
          debug('resolver() nextTick() reject() role: ' + util.inspect(role) + 
                ', principals: ' + util.inspect(context.principals) +
                ', originalUrl: ' + context.remotingContext.req.originalUrl +
                ', allowed: false');
          if (cb) cb(null, false);
        });
      }

      var principals = context.principals;
      var originalUrl = context.remotingContext.req.originalUrl
      if (!principals || !principals[0] || !principals[0].id) 
        return reject();

      // searchFor should include substring search on URL!!!
      var searchFor = {where: {userId: principals[0].id}};
      debug('resolver() nextTick() Searching for userId = %s', principals[0].id);

      AccessManager.find(searchFor, function(err, rules) {
        var allowed = true;
        debug('resolver() nextTick() find result. id: ' + principals[0].id + 
              ' access manager rules: ' + util.inspect(rules) +
              ' err: ' + err);
        if (err) throw err;

        if (!rules.length)
          return reject();

        var filteredRules = rules.filter(
          function(rule) {
            var res = (new RegExp(rule.baseUrl)).test(originalUrl);
            debug('resolver() nextTick() Test rule result: %s, baseUrl %s, originalUrl: %s', 
              res, rule.baseUrl, originalUrl);
            return res;
          });

        debug('resolver() nextTick() Filtered result: ' + util.inspect(filteredRules));  
        if (!filteredRules.length)
          return reject();

        debug('resolver() nextTick() role: ' + util.inspect(role) + 
              ', principals: ' + util.inspect(context.principals) +
              ', originalUrl: ' + originalUrl + 
              ', allowed: ' + allowed);

        if (cb) cb(null, allowed);
      });
    });
  }
};
