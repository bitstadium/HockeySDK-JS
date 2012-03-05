HockeyApp = {
  sendError:function(error) {
    var that    = this;

    this.defaults = {
      appID: '7f6caf2cb70353e883c869f8299088b2',
      bundleIdentifier: 'custom',
      //url: 'https://rink.hockeyapp.net/api/2/apps/',
      url: 'http://hockeyapp.local:8080/api/2/apps/',
      version: '1.0'
    };

    this.data = [];
    this.data.push("Package: " + this.defaults.bundleIdentifier);
    this.data.push("Version: " + this.defaults.version);
    this.data.push("Platform: " + window.navigator.platform);
    this.data.push("User-Agent: " + window.navigator.userAgent);
    this.data.push("");
    this.data.push(error);

    if ((this.data) && (this.defaults.url) && (this.defaults.appID)) {
      var url = this.defaults.url + this.defaults.appID + "/crashes/js" + '?raw=' + escape(this.data.join("\n"));
      if ($('#hockeyapp-iframe')[0]) {
        $('#hockeyapp-iframe').attr('src', url);
      } 
      else {
        $('body').append('<iframe id="hockeyapp-iframe" src="' + url + '" width="1" height="1">');
      }
    }
  }

  reportException:function(exception) {
    sendError(exception.stack);
  }
};