// Top-level form module for programmictally assembling form behaviors
define([
  'nbd/Class',
  'nbd/trait/promise',
  'lib/form/decompose',
  'lib/xhr'
], function(Class, Promise, decompose, xhr) {
  'use strict';

  var normalizeSubmitter = function(e) {
    switch (e.which) {
      // Left mouse
      case 1:
      // Enter
      case 13:
      // Spacebar
      case 32:
        this.$form.submit();
        break;
      default:
        break;
    }
  },

  initChain = function(e) {
    e.preventDefault();

    var chain = new Promise(),
        formMetadata = {
          url: this.$form.attr('action'),
          type: this.$form.attr('type') || 'POST',
          data: decompose(this.$form.serializeArray())
        };

    this._submit(chain);
    chain.resolve(formMetadata);
  },

  Form = Class.extend({
    init: function($context) {
      this.$form = $context;

      // Internal bindings so that we can unbind later
      this._normalizeSubmitter = normalizeSubmitter.bind(this);
      this._initChain = initChain.bind(this);

      this._bindSubmission();
    },

    destroy: function() {
      this._unbindSubmission();
      this.$form = null;
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

    _bindSubmission: function() {
      this.$form
      .on('click keydown', '.form-submit:not([type=submit])', this._normalizeSubmitter)
      .on('submit', this._initChain);
    },

    _unbindSubmission: function() {
      this.$form
      .off('click keydown', '.form-submit:not([type=submit])', this._normalizeSubmitter)
      .off('submit', this._initChain);
    }
  });

  return Form;
});
