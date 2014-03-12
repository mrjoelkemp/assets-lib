define(function() {
  'use strict';

    //$url = trim( $url );

    //if ( strpos( $url, "//" ) === 0 ) {
      //$url = "{$protocol}:{$url}";
    //}
    //elseif ( strpos( $url, $protocol ) !== 0 ) {
      //$url = $protocol . '://' . $url;
    //}

    //return $url;
    //
    //$url      = Core_Utils::prefixUrl($matches[0]);
    //$url_text = $matches[0];
    //$extra    = '';

    //// get rid of trailing period if caught by regex
    //if (preg_match('/\.$/',$url)) {
      //$url_text = rtrim($url_text, '.');
      //$url      = rtrim($url, '.');
      //$extra = '.';
    //}

    //$new_url  = '<a href="'.trim($url).'">'.trim($url_text).'</a>'.$extra;

    //$new_url  = ( preg_match( '/^[\s\r\n]/', $url_text ) ) ? ' '.$new_url : $new_url; // space vs empty

    //return $new_url;

  var URL_REGEX = /(?:\A|\s)(?:[^"\'\s\n\r -])?((?:http(?:s)?\:\/\/|(?:[^\/])?www\.)[^<"\r\n\s]+)/gi;

  return function(rawText) {
    return rawText.replace(URL_REGEX, function(url) {
      url = url.trim();

      var wrappedText = ' <a href="' + url + '" target="_blank">' + url + '</a>';

      return wrappedText;
    });
  };
});
