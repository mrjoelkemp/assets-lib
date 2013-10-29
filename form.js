// Top-level form module for programmictally assembling form behaviors
define([
  'nbd/Class',
  'nbd/trait/promise',
  'lib/form/decompose',
  'lib/xhr'
], function(Class, Promise, decompose, xhr) {
  'use strict';

  var Form = Class.extend({
    init: function($context) {
      this.$context = $context;
    },

    /**
     * Inner Submission process. Should be limited to the forms specific behaviors that are
     * dependent on pre- and post- submission of the form. For the majority of simple forms,
     * this should be all that needs to be overridden.
     *
     * Default implementation simply submits the form data to the form's defined endpoint.
     */
    commit: function(metadata) {
      return this;
    },

    /**
     * Private function that handles the steps necessary to submit the form. This should be
     * overridden in subclasses.
     *
     * The base implementation calls the submission function to determine whether to return
     * submission's return value or ajax submit the form.
     */
    _submit: function(chain) {
      return chain
      .then(function(metadata) {
        var chain = new Promise(),
            then = chain.thenable(),
            retval;

        retval = this.commit.call(then, metadata);
        chain.resolve(retval === then ? xhr(metadata) : retval);

        return chain;
      }.bind(this));
    },

    onSubmit: function() {
      var self = this;

      this._bindSubmission();

      this.$context.on('submit', function() {
        var chain = new Promise(),
            formMetadata = {
              url: self.$context.attr('action'),
              type: self.$context.attr('type') || 'POST',
              data: decompose(self.$context.serializeArray())
            };

        self._submit(chain);
        chain.resolve(formMetadata);
      });
    },

    _bindSubmission: function() {
      var self = this;

      this.$context.on('click keydown', '.form-submit:not([type=submit])', function(e) {
        switch (e.which) {
          // Left mouse
          case 1:
          // Enter
          case 13:
          // Spacebar
          case 32:
            self.$context.submit();
            break;
          default:
            break;
        }
      });
    }
  });

  return Form;
});
