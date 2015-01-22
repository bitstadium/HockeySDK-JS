/*!

The Hockey SDK is provided under the following license:

Copyright (c) 2011 - 2014 HockeyApp, Bit Stadium GmbH.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

(function(context){

"use strict";

context.HockeyApp = {
  defaults: {
    appID: 'APP_ID',
    bundleIdentifier: 'BUNDLE_IDENTIFIER',
    url: 'https://rink.hockeyapp.net/api/2/apps/',
    version: 'VERSION'
  },

  settings: {},

  init:function(options) {
    HockeyApp.settings = $.extend({}, HockeyApp.defaults, options);
  },

  sendError:function(error, description) {
    this.data = [];
    this.data.push("Package: " + this.settings.bundleIdentifier);
    this.data.push("Version: " + this.settings.version);
    this.data.push("Language: " + window.navigator.language);
    this.data.push("Platform: " + window.navigator.platform);
    this.data.push("User-Agent: " + window.navigator.userAgent);
    this.data.push("");
    this.data.push(error);

    if ((this.data) && (this.settings.url) && (this.settings.appID)) {
      var url = this.settings.url + this.settings.appID + "/crashes/js";
      url += '?raw=' + encodeURIComponent(this.data.join("\n"));
      if (description != null) {
        url += '&description=' + encodeURIComponent(description);
      }

      if ($('#hockeyapp-iframe')[0]) {
        $('#hockeyapp-iframe').attr('src', url);
      } 
      else {
        $('body').append('<iframe id="hockeyapp-iframe" src="' + url + '" width="1" height="1">');
      }
    }
  },

  reportMessage:function(message, method, url, lineNumber) {
    if (url != null) {
      this.sendError(message + "\n  at " + method + " (" + url + ":" + lineNumber + ")");
    }
    else {
      this.sendError(message);
    }
  },

  reportException:function(exception) {
    this.sendError(exception.stack);
  },

  generateTrace:function() {
    try {
      throw new Error();
    } 
    catch (e) {
      if (e.stack) {
        var lines = e.stack.split("\n");
        if (lines.length > 2) {
          lines.shift();
          lines.shift();
          return lines.join("\n");
        }
      } 
    }
    return '  at unknown';
  }
};

})(window);

