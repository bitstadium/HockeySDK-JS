
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

