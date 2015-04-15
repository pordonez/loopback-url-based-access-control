var debug = require('../../node_modules/loopback/node_modules/debug')('aclmod:AccessRule');
var util = require('util');

module.exports = function(AccessRule) {

  AccessRule.ADMIN = 'admin';
  AccessRule.VIEW = 'view';

  AccessRule.resolver = function(role, context, cb) {
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

      AccessRule.find(searchFor, function(err, rules) {
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

        var longestRule = null;
        filteredRules.forEach(
          function(rule) {
            if (!longestRule || rule.baseUrl.length > longestRule.baseUrl.length)
              longestRule = rule;
          });
        
        var allowed = false;      
        switch (longestRule.accessType) {
          case AccessRule.ADMIN:
            allowed = true;
            break;
          case AccessRule.VIEW:
            allowed = context.accessType != 'EXECUTE' && context.accessType != 'WRITE'?true:false;
            break;
        }

        debug('resolver() nextTick() role: ' + util.inspect(role) + 
              ', accessType', context.accessType +
              ', principals: ' + util.inspect(context.principals) +
              ', originalUrl: ' + originalUrl + 
              ', allowed: ' + allowed);

        if (cb) cb(null, allowed);
      });
    });
  }
};
