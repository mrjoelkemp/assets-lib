/*
 * Adobe Analytics tracking. s_adobe comes from their script
 */
/*global s_adobe */
define({
  page: function() {
    // Safeguard in case module is loaded without script on page
    if (typeof s_adobe === 'undefined') {
      return;
    }

    s_adobe.pageName = (window.location.hostname + window.location.pathname)
                        .replace(/\//g, ':')
                        .replace(/^www\./, '');

    s_adobe.t();
  }
});
