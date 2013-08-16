/*
 * Google Analytics tracking
 * IMPORTANT: This module is untestable locally without commenting out 
 * _setDomainName from google script
 */
/*global _gaq */
define({
  page : function(url) {
    try {
      if ( _gaq !== undefined ) {
        _gaq.push(['_trackPageview', url || location.href]);
      }
    } catch (gaqError) {}
  },

  event : function(category, action, label, value, noninteract) {
    try {
      if ( typeof _gaq !== 'undefined' ) {
        var arr = Array.prototype.slice.call(arguments);
        arr.unshift('_trackEvent');
        _gaq.push(arr);
      }
    } catch (gaqError) {}
  },

  customVar : function(index, name, value, scope) {
    if (!(index && name && value !== undefined)) { return; }
    try {
      if ( typeof _gaq !== 'undefined' ) {
        var arr = Array.prototype.slice.call(arguments);
        arr.unshift('_setCustomVar');
        _gaq.push(arr);
      }
    } catch (gaqError) {}
  }
});
