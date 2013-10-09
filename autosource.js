define(['jquery', 'nbd/Class'], function($, Class) {
  'use strict';

  var
  // Helper methods
  push = Array.prototype.push,
  addRemote = function() {
    push.apply(this._remotes, arguments);
    return this.source;
  },
  addLocal = function() {
    push.apply(this._local, arguments);
    return this.source;
  },
  merge = function() {
    return Array.prototype.concat.apply([], arguments);
  },
  mergeLocal = function(search, arr) {
    return this.filter( [], search ).concat(arr);
  },

  AutoSource = Class.extend({
    options : {
      maxLocal : Infinity,
      caseInsensitive : false
    },

    init : function( options ) {
      this._remotes = [];
      this._local = [];

      $.extend(this.options, options);

      // These methods are extended onto source to ensure chainability
      this.source = $.extend(this.source.bind(this), {
        addRemote : addRemote.bind(this),
        addLocal : addLocal.bind(this)
      });
    },

    /**
     * Function meant to return a deferred object from the added remotes
     * The context of this function is the search object.
     *
     * @param {String|Function} value A remote added by addRemote()
     * @see filter
     */
    callRemote : function(value) {
      if ( $.isFunction( value ) ) {
        return value(this);
      }
      if (typeof value === 'string') {
        return $.ajax({url:value, data:this});
      }
      return value;
    },

    /**
     * Function meant to return objects to be merged into a single array
     * for the filter function to run on.
     *
     * @param {Function|Object} value Either the literal data object or a function that returns it
     */
    callLocal : function(value) {
      if ( $.isFunction( value ) ) {
        return value(this);
      }
      return value;
    },

    /**
     * Searches for substring match with search.term as the needle
     * and _local item values as hay.
     *
     * @param {Object} search Object with term as the string to match
     * @memoizes
     */
    filter : function filter(cache, search) {
      this._filterMemo = this._filterMemo || {};

      var i, value,
      results = [],
      maxLength = this.options.maxLocal || Infinity,

      term = search.term;
      if ( this.options.caseInsensitive ) {
        term = term.toLocaleLowerCase();
      }

      if (this._filterMemo[term]) { return this._filterMemo[term]; }

      for (i=0; i < cache.length && results.length < maxLength; ++i) {
        value = cache[i].value;

        if (this.options.caseInsensitive) {
          value = value.toLocaleLowerCase();
        }

        if (value.indexOf(term) >= 0) {
          results.push(cache[i]);
        }
      }

      return (this._filterMemo[term] = results);
    },

    /**
     * Function meant to be handed to an autocomplete/autosuggest
     */
    source : function( search, callback ) {
      // Run the local search first
      var local = this._local.length ?
        this.filter(merge.apply(null, this._local.map(this.callLocal, search)), search) :
        [];

      if ( this._remotes.length ) {
        if (local.length) { callback(local); }

        // Run the remote searches
        $.when.apply($, this._remotes.map(this.callRemote, search))
        .then(merge)
        .then(mergeLocal.bind(this, search))
        .then(callback);
      }
      else {
        callback(local);
      }
    }
  });

  function autosource(config) {
    var Source = new AutoSource(config);
    return Source.source;
  }
  autosource.constructor = AutoSource;

  return autosource;
});
