define([
  'nbd/Class',
  'nbd/trait/pubsub',
  'nbd/util/construct',
  'nbd/util/extend',
  'lib/infinitescroll',
  'lib/xhr'
], function(Class, pubsub, construct, extend, infinitescroll, xhr) {
  'use strict';

  return Class.extend({
    init: function(context, offset) {
      this.context = context || 'window';
      this.resetParams(offset);
    },

    _firstLoad: true,
    _hasMore: true,
    _isLoading: false,
    breakpoint: 1.1,
    offset: 0,
    data: {},
    url: window.location.href,
    infinitescroll: infinitescroll,
    xhr: xhr,

    hasMoreResults: function(response) {
      throw "InfiniteLoader requires a 'hasMoreResults(response)' function. Please extend and implement.";
    },

    getNextOffset: function(response) {
      throw "InfiniteLoader requires a 'getNextOffset(response)' function. Please extend and implement.";
    },

    loaded: function(response, empty) {
      throw "InfiniteLoader requires a 'loaded(response, empty)' function. Please extend and implement.";
    },

    resetParams: function(offset, data, url) {
      this.offset = offset || 0;
      this.data = data || {};
      this.url = url || window.location.href;
    },

    setParams: function(offset, data, url) {
      if (offset != null) {
        this.offset = offset;
      }
      if (data != null) {
        this.data = data;
      }
      if (url != null) {
        this.url = url;
      }
    },

    unbind: function() {
      if (!this.boundFunction) {
        return;
      }

      this.infinitescroll.remove(this.boundFunction, this.context);
      this.boundFunction = false;
    },

    bind: function() {
      if (this.boundFunction) {
        return;
      }

      this.boundFunction = this.load.bind(this);

      this.infinitescroll(this.breakpoint, this.boundFunction, this.context);
    },

    offsetKey: 'offset',

    _trackLoadingState: function(response) {
      this._hasMore = this.hasMoreResults(response);
      this.offset = this.getNextOffset(response);
      return response;
    },

    _handleXhrFailure: function(response) {
      this._isLoading = false;
      this._hasMore = false;
      this.offset = 0;

      this.trigger('error', response);
      throw response;
    },

    _handleResponseLoaded: function(originalOffset, response) {
      var empty = originalOffset === 0 && this._firstLoad && !this._hasMore;
      this._firstLoad = false;

      this.trigger(empty ? 'empty' : 'loaded', response);
      return this.loaded(response, empty);
    },

    _resetLoadingState: function() {
      this._isLoading = false;
      this.trigger('after');
    },

    load: function() {
      if (this._isLoading || !this._hasMore) {
        return;
      }

      this._isLoading = true;
      this.trigger('loading');

      var data = extend({}, this.data),
          originalOffset = this.offset;

      data[this.offsetKey] = originalOffset;

      return this.xhr({
        url: this.url,
        data: data
      })
      .then(this._trackLoadingState.bind(this), this._handleXhrFailure.bind(this))
      .then(this._handleResponseLoaded.bind(this, originalOffset))
      .then(this._resetLoadingState.bind(this))
      .then(this.infinitescroll.check.bind(this, this.context));
    },

    reload: function(offset, data, url) {
      this.resetParams(offset, data, url);
      this._hasMore = true;
      this._firstLoad = true;
      return this.load();
    }
  }, {
    init: function(context, offset) {
      var self = construct.apply(this, arguments);
      self.bind();
      return self;
    }
  })
  .mixin(pubsub);
});
