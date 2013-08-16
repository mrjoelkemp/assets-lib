/*
 * Specifically for loading more stuff
 * when they have see-more-button-container
 * Use the static init() method, it's a factory
 */
define(['jquery', 'nbd/Class', 'nbd/util/construct', 'nbd/util/extend'
], function($, Class, construct, extend) {
  'use strict';

  var constructor = Class.extend({

    loading : false,

    init : function($content, data, callback) {
      this.data = data || {};
      this.callback = callback;
      this.loading = false;
      this.$content = $content;

      this.$more = $('.see-more-button-container', this.data.$pagination);

      this.get = this.more.bind(this, undefined);

      this.$more.on('click', this.get);

      this.before();
    },

    set : function(data) {
      extend(this.data, data);
      return this;
    },

    destroy : function() {
      this.$more.off('click', this.get);
    },

    load : function(obj) {
      return $.ajax({
        data : $.extend({}, this.data, obj)
      });
    },

    more : function(option) {
      return this.load(option)
      .then(this.render.bind(this))
      .done(this.after.bind(this))
      .done(this.callback);
    },

    render : function(response) {
      this.loading = false;

      return response.html ?
        $(response.html).appendTo(this.$content) :
        response;
    },

    before : function() {},

    after : function() {}

  }, {
    init : function() {
      return construct.apply(this, arguments);
    }
  });

  return constructor;
});
