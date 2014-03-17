define(function() {
  'use strict';

  var DEFAULT_PROTOCOL = 'http',
      URL_REGEX = /(?:^|\s)(?:[^"\'\s\n\r -])?((?:http(?:s)?\:\/\/|(?:[^\/])?www\.)[^<"\r\n\s]+)/gi,
      TRAILING_PERIOD_REGEX = /\.$/,
      SPACE_START_REGEX = /^[\s\r\n]/;

  function prefix(url, protocol) {
    protocol = protocol || DEFAULT_PROTOCOL;

    if (url.indexOf('//') === 0) {
      url = protocol + ':' + url;
    }
    else if (url.indexOf(protocol) !== 0) {
      url = protocol + '://' + url;
    }

    return url;
  }

  return function(rawText, protocol) {
    return rawText.replace(URL_REGEX, function(url) {
      var urlText = url.trim(),
          extra;

      if (TRAILING_PERIOD_REGEX.test(urlText)) {
        urlText = urlText.slice(0, -1);
        extra = '.';
      }

      var prefixedUrl = prefix(urlText, protocol),
          wrappedText = '<a href="' + prefixedUrl + '" target="_blank">' + urlText + '</a>';

      if (extra) {
        wrappedText += extra;
      }

      return SPACE_START_REGEX.test(url) ? ' ' + wrappedText : wrappedText;
    });
  };
});
