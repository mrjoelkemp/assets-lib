/*global requirejs */
define(['nbd/util/extend'], function(extend) {
  var sideload = requirejs.config(
    extend({},
           /* RequireJS default context */
           requirejs.s.contexts._.config,
           { context:'sideload' })
  );

  return function(moduleName, cachebuster) {
    var args = [[moduleName], function(module) {
      requirejs.undef(moduleName);
      define(moduleName, function() { return module; });
      requirejs([moduleName]);
      sideload.undef(moduleName);
    }];

    if (cachebuster) {
      args.unshift({ urlArgs: "cb="+cachebuster });
    }

    sideload.apply(null, args);
  };
});
