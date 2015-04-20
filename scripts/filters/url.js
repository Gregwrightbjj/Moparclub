'use strict';

app.filter('hostnameFromUrl', function () {
  return function (str) {
    var parser = document.createElement('a');

    parser.href = str;

    return parser.hostname;
  };
});