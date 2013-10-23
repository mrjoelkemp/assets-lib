define(function() {
  'use strict';

  /**
   * Takes a serialized Array (such as from $.serializeArray) and
   * transforms it into a JSON structure apporpriate for sending
   * as data over and ajax request.
   *
   * @param {Array} inputs - List objects with the form { name: value }
   *
   * @return {Object} obj - Map of input names to input values
   */
  function decompose(inputs) {
    return inputs.reduce(function(obj, entry) {
      var val = obj[entry.name];

      obj[entry.name] = val ?
        // Format selects into { name: [value1, value2,...] }
        [].concat(val, entry.value) :
        entry.value;

      return obj;
    }, {});
  }

  return decompose;
});
