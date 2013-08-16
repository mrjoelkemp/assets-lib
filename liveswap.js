/*global requirejs */
define(['nbd/util/extend'], function(extend) {
  var sideload = requirejs.config(
    extend({},
           /* RequireJS default context */
           requirejs.s.contexts._.config,
           { context:'sideload' })
  );

  return function(moduleName, cachebuster) {
    var conf = cachebuster ?
      { urlArgs: "cb="+cachebuster } :
      {};

    sideload(conf, [moduleName], function(module) {
      requirejs.undef(moduleName);
      define(moduleName, function() { return module; });
      requirejs([moduleName]);
      sideload.undef(moduleName);
    });
  };
});
