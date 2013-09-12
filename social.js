// Initialize 3rd party social sharing widgets
/*global FB, twttr, IN, STMBLPN */
define(['jquery'], function($) {
  'use strict';

  var api = {
    init : function($context) {
      this.twitter($context);
      this.facebook($context);
      this.linkedin($context);
      this.pinterest($context);
      this.stumbledupon($context);
    },

    twitter : function($context) {
      if ($('.viral-button-twitter', $context).length) {
        require(['//platform.twitter.com/widgets.js'], function() {
          twttr.widgets.load();
        });
      }
    },

    linkedin : function($context) {
      if ($('.viral-button-linkedin', $context).length) {
        require(['//platform.linkedin.com/in.js'], function() {
          if (IN && IN.parse) { IN.parse(); }
        });
      }
    },

    facebook : function($context) {
      if ($('.fb-like', $context).length) {
        require(['//connect.facebook.net/en_US/all.js#xfbml=1'], function() {
          FB.XFBML.parse();
        });
      }
    },

    pinterest : function pinterest($context) {
      $('.viral-button-pinterest', $context).on('click', function() {
        require(['//assets.pinterest.com/js/pinmarklet.js'], function() {
          if (pinterest.PIN) {
            pinterest.PIN.f.init();
            return;
          }

          pinterest.PIN = Object.keys(window).filter(function(key) {
            return (/^PIN_/).test(key);
          })[0];
        });
      });
    },

    stumbledupon : function($context) {
      if ($('.viral-button-stumble', $context).length) {
        require(['//platform.stumbleupon.com/1/widgets.js'], function() {
          STMBLPN.processWidgets();
        });
      }
    }
  };

  return api;
});
