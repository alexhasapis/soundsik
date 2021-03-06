(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.Teaspoon = (function() {
    function Teaspoon() {}

    Teaspoon.defer = false;

    Teaspoon.slow = 75;

    Teaspoon.root = window.location.pathname.replace(/\/+(index\.html)?$/, "").replace(/\/[^\/]*$/, "");

    Teaspoon.started = false;

    Teaspoon.finished = false;

    Teaspoon.Reporters = {};

    Teaspoon.Date = Date;

    Teaspoon.location = window.location;

    Teaspoon.messages = [];

    Teaspoon.execute = function() {
      if (Teaspoon.defer) {
        Teaspoon.defer = false;
        return;
      }
      if (Teaspoon.started) {
        Teaspoon.reload();
      }
      Teaspoon.started = true;
      return new Teaspoon.Runner();
    };

    Teaspoon.reload = function() {
      return window.location.reload();
    };

    Teaspoon.onWindowLoad = function(method) {
      var originalOnload;
      originalOnload = window.onload;
      return window.onload = function() {
        if (originalOnload && originalOnload.call) {
          originalOnload();
        }
        return method();
      };
    };

    Teaspoon.resolveDependenciesFromParams = function(all) {
      var dep, deps, file, i, j, len, len1, parts, path, paths;
      if (all == null) {
        all = [];
      }
      deps = [];
      if ((paths = Teaspoon.location.search.match(/[\?&]file(\[\])?=[^&\?]*/gi)) === null) {
        return all;
      }
      for (i = 0, len = paths.length; i < len; i++) {
        path = paths[i];
        parts = decodeURIComponent(path.replace(/\+/g, " ")).match(/\/(.+)\.(js|js.coffee|coffee)$/i);
        if (parts === null) {
          continue;
        }
        file = parts[1].substr(parts[1].lastIndexOf("/") + 1);
        for (j = 0, len1 = all.length; j < len1; j++) {
          dep = all[j];
          if (dep.indexOf(file) >= 0) {
            deps.push(dep);
          }
        }
      }
      return deps;
    };

    Teaspoon.log = function() {
      var e;
      Teaspoon.messages.push(arguments[0]);
      try {
        return console.log.apply(console, arguments);
      } catch (_error) {
        e = _error;
        throw new Error("Unable to use console.log for logging");
      }
    };

    Teaspoon.getMessages = function() {
      var messages;
      messages = Teaspoon.messages;
      Teaspoon.messages = [];
      return messages;
    };

    return Teaspoon;

  })();

  Teaspoon.Error = (function(superClass) {
    extend(Error, superClass);

    function Error(message) {
      this.name = "TeaspoonError";
      this.message = message || "";
    }

    return Error;

  })(Error);

}).call(this);
(function() {
  Teaspoon.Runner = (function() {
    Runner.run = false;

    function Runner() {
      if (this.constructor.run) {
        return;
      }
      this.constructor.run = true;
      this.fixturePath = Teaspoon.root + "/fixtures";
      this.params = Teaspoon.params = this.getParams();
      this.setup();
    }

    Runner.prototype.getParams = function() {
      var i, len, name, param, params, ref, ref1, value;
      params = {};
      ref = Teaspoon.location.search.substring(1).split("&");
      for (i = 0, len = ref.length; i < len; i++) {
        param = ref[i];
        ref1 = param.split("="), name = ref1[0], value = ref1[1];
        params[decodeURIComponent(name)] = decodeURIComponent(value);
      }
      return params;
    };

    Runner.prototype.getReporter = function() {
      if (this.params["reporter"]) {
        return Teaspoon.Reporters[this.params["reporter"]];
      } else {
        if (window.navigator.userAgent.match(/PhantomJS/)) {
          return Teaspoon.Reporters.Console;
        } else {
          return Teaspoon.Reporters.HTML;
        }
      }
    };

    Runner.prototype.setup = function() {};

    return Runner;

  })();

}).call(this);
(function() {
  var slice = [].slice;

  Teaspoon.fixture = (function() {
    var addContent, cleanup, create, load, loadComplete, preload, putContent, set, xhr, xhrRequest;

    fixture.cache = {};

    fixture.el = null;

    fixture.$el = null;

    fixture.json = [];

    fixture.preload = function() {
      var i, len, results, url, urls;
      urls = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      results = [];
      for (i = 0, len = urls.length; i < len; i++) {
        url = urls[i];
        results.push(preload(url));
      }
      return results;
    };

    fixture.load = function() {
      var append, i, index, j, len, results, url, urls;
      urls = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), append = arguments[i++];
      if (append == null) {
        append = false;
      }
      if (typeof append !== "boolean") {
        urls.push(append);
        append = false;
      }
      results = [];
      for (index = j = 0, len = urls.length; j < len; index = ++j) {
        url = urls[index];
        results.push(load(url, append || index > 0));
      }
      return results;
    };

    fixture.set = function() {
      var append, html, htmls, i, index, j, len, results;
      htmls = 2 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 1) : (i = 0, []), append = arguments[i++];
      if (append == null) {
        append = false;
      }
      if (typeof append !== "boolean") {
        htmls.push(append);
        append = false;
      }
      results = [];
      for (index = j = 0, len = htmls.length; j < len; index = ++j) {
        html = htmls[index];
        results.push(set(html, append || index > 0));
      }
      return results;
    };

    fixture.cleanup = function() {
      return cleanup();
    };

    function fixture() {
      Teaspoon.fixture.load.apply(window, arguments);
    }

    xhr = null;

    preload = function(url) {
      return load(url, false, true);
    };

    load = function(url, append, preload) {
      var cached, value;
      if (preload == null) {
        preload = false;
      }
      if (cached = Teaspoon.fixture.cache[url]) {
        return loadComplete(url, cached.type, cached.content, append, preload);
      }
      value = null;
      xhrRequest(url, function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          throw "Unable to load fixture \"" + url + "\".";
        }
        return value = loadComplete(url, xhr.getResponseHeader("content-type"), xhr.responseText, append, preload);
      });
      return value;
    };

    loadComplete = function(url, type, content, append, preload) {
      Teaspoon.fixture.cache[url] = {
        type: type,
        content: content
      };
      if (type.match(/application\/json;/)) {
        return fixture.json[fixture.json.push(JSON.parse(content)) - 1];
      }
      if (preload) {
        return content;
      }
      if (append) {
        addContent(content);
      } else {
        putContent(content);
      }
      return Teaspoon.fixture.el;
    };

    set = function(content, append) {
      if (append) {
        return addContent(content);
      } else {
        return putContent(content);
      }
    };

    putContent = function(content) {
      cleanup();
      create();
      return Teaspoon.fixture.el.innerHTML = content;
    };

    addContent = function(content) {
      if (!Teaspoon.fixture.el) {
        create();
      }
      return Teaspoon.fixture.el.innerHTML += content;
    };

    create = function() {
      var ref;
      Teaspoon.fixture.el = document.createElement("div");
      if (typeof window.$ === 'function') {
        Teaspoon.fixture.$el = $(Teaspoon.fixture.el);
      }
      Teaspoon.fixture.el.id = "teaspoon-fixtures";
      return (ref = document.body) != null ? ref.appendChild(Teaspoon.fixture.el) : void 0;
    };

    cleanup = function() {
      var base, ref, ref1;
      (base = Teaspoon.fixture).el || (base.el = document.getElementById("teaspoon-fixtures"));
      if ((ref = Teaspoon.fixture.el) != null) {
        if ((ref1 = ref.parentNode) != null) {
          ref1.removeChild(Teaspoon.fixture.el);
        }
      }
      return Teaspoon.fixture.el = null;
    };

    xhrRequest = function(url, callback) {
      var e;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (_error) {
          e = _error;
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (_error) {
            e = _error;
          }
        }
      }
      if (!xhr) {
        throw "Unable to make Ajax Request";
      }
      xhr.onreadystatechange = callback;
      xhr.open("GET", Teaspoon.root + "/fixtures/" + url, false);
      return xhr.send();
    };

    return fixture;

  })();

}).call(this);
(function() {
  Teaspoon.hook = function(name, payload) {
    var xhr, xhrRequest;
    if (payload == null) {
      payload = {};
    }
    xhr = null;
    xhrRequest = function(url, payload, callback) {
      var e;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (_error) {
          e = _error;
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (_error) {
            e = _error;
          }
        }
      }
      if (!xhr) {
        throw "Unable to make Ajax Request";
      }
      xhr.onreadystatechange = callback;
      xhr.open("POST", Teaspoon.root + "/" + url, false);
      xhr.setRequestHeader("Content-Type", "application/json");
      return xhr.send(JSON.stringify({
        args: payload
      }));
    };
    return xhrRequest(Teaspoon.suites.active + "/" + name, payload, function() {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status !== 200) {
        throw "Unable to call hook \"" + url + "\".";
      }
    });
  };

}).call(this);
(function() {
  Teaspoon.Reporters.BaseView = (function() {
    function BaseView() {
      this.elements = {};
      this.build();
    }

    BaseView.prototype.build = function(className) {
      return this.el = this.createEl("li", className);
    };

    BaseView.prototype.appendTo = function(el) {
      return el.appendChild(this.el);
    };

    BaseView.prototype.append = function(el) {
      return this.el.appendChild(el);
    };

    BaseView.prototype.createEl = function(type, className) {
      var el;
      if (className == null) {
        className = "";
      }
      el = document.createElement(type);
      el.className = className;
      return el;
    };

    BaseView.prototype.findEl = function(id) {
      var base;
      this.elements || (this.elements = {});
      return (base = this.elements)[id] || (base[id] = document.getElementById("teaspoon-" + id));
    };

    BaseView.prototype.setText = function(id, value) {
      var el;
      el = this.findEl(id);
      return el.innerHTML = value;
    };

    BaseView.prototype.setHtml = function(id, value, add) {
      var el;
      if (add == null) {
        add = false;
      }
      el = this.findEl(id);
      if (add) {
        return el.innerHTML += value;
      } else {
        return el.innerHTML = value;
      }
    };

    BaseView.prototype.setClass = function(id, value) {
      var el;
      el = this.findEl(id);
      return el.className = value;
    };

    BaseView.prototype.htmlSafe = function(str) {
      var el;
      el = document.createElement("div");
      el.appendChild(document.createTextNode(str));
      return el.innerHTML;
    };

    return BaseView;

  })();

}).call(this);
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Teaspoon.Reporters.HTML = (function(superClass) {
    extend(HTML, superClass);

    function HTML() {
      this.changeSuite = bind(this.changeSuite, this);
      this.toggleConfig = bind(this.toggleConfig, this);
      this.reportRunnerResults = bind(this.reportRunnerResults, this);
      this.start = new Teaspoon.Date().getTime();
      this.config = {
        "use-catch": true,
        "build-full-report": false,
        "display-progress": true
      };
      this.total = {
        exist: 0,
        run: 0,
        passes: 0,
        failures: 0,
        skipped: 0
      };
      this.views = {
        specs: {},
        suites: {}
      };
      this.filters = [];
      this.setFilters();
      this.readConfig();
      HTML.__super__.constructor.apply(this, arguments);
    }

    HTML.prototype.build = function() {
      var ref;
      this.buildLayout();
      this.setText("env-info", this.envInfo());
      this.setText("version", Teaspoon.version);
      this.findEl("toggles").onclick = this.toggleConfig;
      this.findEl("suites").innerHTML = this.buildSuiteSelect();
      if ((ref = this.findEl("suite-select")) != null) {
        ref.onchange = this.changeSuite;
      }
      this.el = this.findEl("report-all");
      this.showConfiguration();
      this.buildProgress();
      return this.buildFilters();
    };

    HTML.prototype.buildLayout = function() {
      var el;
      el = this.createEl("div");
      el.id = "teaspoon-interface";
      el.innerHTML = Teaspoon.Reporters.HTML.template();
      return document.body.appendChild(el);
    };

    HTML.prototype.buildSuiteSelect = function() {
      var filename, i, len, options, path, ref, selected, suite;
      if (Teaspoon.suites.all.length === 1) {
        return "";
      }
      filename = "";
      if (/index\.html$/.test(window.location.pathname)) {
        filename = "/index.html";
      }
      options = [];
      ref = Teaspoon.suites.all;
      for (i = 0, len = ref.length; i < len; i++) {
        suite = ref[i];
        path = [Teaspoon.root, suite].join("/");
        selected = Teaspoon.suites.active === suite ? " selected" : "";
        options.push("<option" + selected + " value=\"" + path + filename + "\">" + suite + "</option>");
      }
      return "<select id=\"teaspoon-suite-select\">" + (options.join("")) + "</select>";
    };

    HTML.prototype.buildProgress = function() {
      this.progress = Teaspoon.Reporters.HTML.ProgressView.create(this.config["display-progress"]);
      return this.progress.appendTo(this.findEl("progress"));
    };

    HTML.prototype.buildFilters = function() {
      if (this.filters.length) {
        this.setClass("filter", "teaspoon-filtered");
      }
      return this.setHtml("filter-list", "<li>" + (this.filters.join("</li><li>")), true);
    };

    HTML.prototype.reportRunnerStarting = function(runner) {
      this.total.exist = runner.total || (typeof runner.specs === "function" ? runner.specs().length : void 0) || 0;
      if (this.total.exist) {
        return this.setText("stats-duration", "...");
      }
    };

    HTML.prototype.reportSpecStarting = function(spec) {
      spec = new Teaspoon.Spec(spec);
      if (this.config["build-full-report"]) {
        this.reportView = new Teaspoon.Reporters.HTML.SpecView(spec, this);
      }
      return this.specStart = new Teaspoon.Date().getTime();
    };

    HTML.prototype.reportSpecResults = function(spec) {
      this.total.run += 1;
      this.updateProgress();
      return this.updateStatus(spec);
    };

    HTML.prototype.reportRunnerResults = function() {
      if (!this.total.run) {
        return;
      }
      this.setText("stats-duration", this.elapsedTime());
      if (!this.total.failures) {
        this.setStatus("passed");
      }
      this.setText("stats-passes", this.total.passes);
      this.setText("stats-failures", this.total.failures);
      if (this.total.run < this.total.exist) {
        this.total.skipped = this.total.exist - this.total.run;
        this.total.run = this.total.exist;
      }
      this.setText("stats-skipped", this.total.skipped);
      return this.updateProgress();
    };

    HTML.prototype.elapsedTime = function() {
      return (((new Teaspoon.Date().getTime() - this.start) / 1000).toFixed(3)) + "s";
    };

    HTML.prototype.updateStat = function(name, value) {
      if (!this.config["display-progress"]) {
        return;
      }
      return this.setText("stats-" + name, value);
    };

    HTML.prototype.updateStatus = function(spec) {
      var elapsed, ref, ref1, result;
      spec = new Teaspoon.Spec(spec);
      result = spec.result();
      if (result.skipped || result.status === "pending") {
        this.updateStat("skipped", this.total.skipped += 1);
        return;
      }
      elapsed = new Teaspoon.Date().getTime() - this.specStart;
      if (result.status === "passed") {
        this.updateStat("passes", this.total.passes += 1);
        return (ref = this.reportView) != null ? ref.updateState("passed", elapsed) : void 0;
      } else {
        this.updateStat("failures", this.total.failures += 1);
        if ((ref1 = this.reportView) != null) {
          ref1.updateState("failed", elapsed);
        }
        if (!this.config["build-full-report"]) {
          new Teaspoon.Reporters.HTML.FailureView(spec).appendTo(this.findEl("report-failures"));
        }
        return this.setStatus("failed");
      }
    };

    HTML.prototype.updateProgress = function() {
      return this.progress.update(this.total.exist, this.total.run);
    };

    HTML.prototype.showConfiguration = function() {
      var key, ref, results, value;
      ref = this.config;
      results = [];
      for (key in ref) {
        value = ref[key];
        results.push(this.setClass(key, value ? "active" : ""));
      }
      return results;
    };

    HTML.prototype.setStatus = function(status) {
      return document.body.className = "teaspoon-" + status;
    };

    HTML.prototype.setFilters = function() {
      if (Teaspoon.params["file"]) {
        this.filters.push("by file: " + Teaspoon.params["file"]);
      }
      if (Teaspoon.params["grep"]) {
        return this.filters.push("by match: " + Teaspoon.params["grep"]);
      }
    };

    HTML.prototype.readConfig = function() {
      var config;
      if (config = this.store("teaspoon")) {
        return this.config = config;
      }
    };

    HTML.prototype.toggleConfig = function(e) {
      var button, name;
      button = e.target;
      if (button.tagName.toLowerCase() !== "button") {
        return;
      }
      name = button.getAttribute("id").replace(/^teaspoon-/, "");
      this.config[name] = !this.config[name];
      this.store("teaspoon", this.config);
      return Teaspoon.reload();
    };

    HTML.prototype.changeSuite = function(e) {
      var options;
      options = e.target.options;
      return window.location.href = options[options.selectedIndex].value;
    };

    HTML.prototype.store = function(name, value) {
      var ref;
      if (((ref = window.localStorage) != null ? ref.setItem : void 0) != null) {
        return this.localstore(name, value);
      } else {
        return this.cookie(name, value);
      }
    };

    HTML.prototype.cookie = function(name, value) {
      var date, match;
      if (value == null) {
        value = void 0;
      }
      if (value === void 0) {
        name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        match = document.cookie.match(new RegExp("(?:^|;)\\s?" + name + "=(.*?)(?:;|$)", "i"));
        return match && JSON.parse(unescape(match[1]).split(" ")[0]);
      } else {
        date = new Teaspoon.Date();
        date.setDate(date.getDate() + 365);
        return document.cookie = name + "=" + (escape(JSON.stringify(value))) + "; expires=" + (date.toUTCString()) + "; path=/;";
      }
    };

    HTML.prototype.localstore = function(name, value) {
      if (value == null) {
        value = void 0;
      }
      if (value === void 0) {
        return JSON.parse(unescape(localStorage.getItem(name)));
      } else {
        return localStorage.setItem(name, escape(JSON.stringify(value)));
      }
    };

    return HTML;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Teaspoon.Reporters.HTML.ProgressView = (function(superClass) {
    extend(ProgressView, superClass);

    function ProgressView() {
      return ProgressView.__super__.constructor.apply(this, arguments);
    }

    ProgressView.create = function(displayProgress) {
      if (displayProgress == null) {
        displayProgress = true;
      }
      if (!displayProgress) {
        return new Teaspoon.Reporters.HTML.ProgressView();
      }
      if (Teaspoon.Reporters.HTML.RadialProgressView.supported) {
        return new Teaspoon.Reporters.HTML.RadialProgressView();
      } else {
        return new Teaspoon.Reporters.HTML.SimpleProgressView();
      }
    };

    ProgressView.prototype.build = function() {
      return this.el = this.createEl("div", "teaspoon-indicator teaspoon-logo");
    };

    ProgressView.prototype.update = function() {};

    return ProgressView;

  })(Teaspoon.Reporters.BaseView);

  Teaspoon.Reporters.HTML.SimpleProgressView = (function(superClass) {
    extend(SimpleProgressView, superClass);

    function SimpleProgressView() {
      return SimpleProgressView.__super__.constructor.apply(this, arguments);
    }

    SimpleProgressView.prototype.build = function() {
      this.el = this.createEl("div", "simple-progress");
      return this.el.innerHTML = "<em id=\"teaspoon-progress-percent\">0%</em>\n<span id=\"teaspoon-progress-span\" class=\"teaspoon-indicator\"></span>";
    };

    SimpleProgressView.prototype.update = function(total, run) {
      var percent;
      percent = total ? Math.ceil((run * 100) / total) : 0;
      return this.setHtml("progress-percent", percent + "%");
    };

    return SimpleProgressView;

  })(Teaspoon.Reporters.HTML.ProgressView);

  Teaspoon.Reporters.HTML.RadialProgressView = (function(superClass) {
    extend(RadialProgressView, superClass);

    function RadialProgressView() {
      return RadialProgressView.__super__.constructor.apply(this, arguments);
    }

    RadialProgressView.supported = !!document.createElement("canvas").getContext;

    RadialProgressView.prototype.build = function() {
      this.el = this.createEl("div", "teaspoon-indicator radial-progress");
      return this.el.innerHTML = "<canvas id=\"teaspoon-progress-canvas\"></canvas>\n<em id=\"teaspoon-progress-percent\">0%</em>";
    };

    RadialProgressView.prototype.appendTo = function() {
      var canvas, e;
      RadialProgressView.__super__.appendTo.apply(this, arguments);
      this.size = 80;
      try {
        canvas = this.findEl("progress-canvas");
        canvas.width = canvas.height = canvas.style.width = canvas.style.height = this.size;
        this.ctx = canvas.getContext("2d");
        this.ctx.strokeStyle = "#fff";
        return this.ctx.lineWidth = 1.5;
      } catch (_error) {
        e = _error;
      }
    };

    RadialProgressView.prototype.update = function(total, run) {
      var half, percent;
      percent = total ? Math.ceil((run * 100) / total) : 0;
      this.setHtml("progress-percent", percent + "%");
      if (!this.ctx) {
        return;
      }
      half = this.size / 2;
      this.ctx.clearRect(0, 0, this.size, this.size);
      this.ctx.beginPath();
      this.ctx.arc(half, half, half - 1, 0, Math.PI * 2 * (percent / 100), false);
      return this.ctx.stroke();
    };

    return RadialProgressView;

  })(Teaspoon.Reporters.HTML.ProgressView);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Teaspoon.Reporters.HTML.SpecView = (function(superClass) {
    var viewId;

    extend(SpecView, superClass);

    viewId = 0;

    function SpecView(spec, reporter) {
      this.spec = spec;
      this.reporter = reporter;
      this.views = this.reporter.views;
      this.spec.viewId = viewId += 1;
      this.views.specs[this.spec.viewId] = this;
      SpecView.__super__.constructor.apply(this, arguments);
    }

    SpecView.prototype.build = function() {
      var classes;
      classes = ["spec"];
      if (this.spec.pending) {
        classes.push("state-pending");
      }
      SpecView.__super__.build.call(this, classes.join(" "));
      this.el.innerHTML = "<a href=\"" + this.spec.link + "\">" + (this.htmlSafe(this.spec.description)) + "</a>";
      this.parentView = this.buildParent();
      return this.parentView.append(this.el);
    };

    SpecView.prototype.buildParent = function() {
      var parent, view;
      parent = this.spec.parent;
      if (parent.viewId) {
        return this.views.suites[parent.viewId];
      } else {
        view = new Teaspoon.Reporters.HTML.SuiteView(parent, this.reporter);
        return this.views.suites[view.suite.viewId] = view;
      }
    };

    SpecView.prototype.buildErrors = function() {
      var div, error, html, i, len, ref;
      div = this.createEl("div");
      html = "";
      ref = this.spec.errors();
      for (i = 0, len = ref.length; i < len; i++) {
        error = ref[i];
        html += "<strong>" + (this.htmlSafe(error.message)) + "</strong><br/>" + (this.htmlSafe(error.stack || "Stack trace unavailable"));
      }
      div.innerHTML = html;
      return this.append(div);
    };

    SpecView.prototype.updateState = function(state, elapsed) {
      var base, classes, result;
      result = this.spec.result();
      classes = ["state-" + state];
      if (elapsed > Teaspoon.slow) {
        classes.push("slow");
      }
      if (state !== "failed") {
        this.el.innerHTML += "<span>" + elapsed + "ms</span>";
      }
      this.el.className = classes.join(" ");
      if (result.status !== "passed") {
        this.buildErrors();
      }
      return typeof (base = this.parentView).updateState === "function" ? base.updateState(state) : void 0;
    };

    return SpecView;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Teaspoon.Reporters.HTML.FailureView = (function(superClass) {
    extend(FailureView, superClass);

    function FailureView(spec) {
      this.spec = spec;
      FailureView.__super__.constructor.apply(this, arguments);
    }

    FailureView.prototype.build = function() {
      var error, html, i, len, ref;
      FailureView.__super__.build.call(this, "spec");
      html = "<h1 class=\"teaspoon-clearfix\"><a href=\"" + this.spec.link + "\">" + (this.htmlSafe(this.spec.fullDescription)) + "</a></h1>";
      ref = this.spec.errors();
      for (i = 0, len = ref.length; i < len; i++) {
        error = ref[i];
        html += "<div><strong>" + (this.htmlSafe(error.message)) + "</strong><br/>" + (this.htmlSafe(error.stack || "Stack trace unavailable")) + "</div>";
      }
      return this.el.innerHTML = html;
    };

    return FailureView;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Teaspoon.Reporters.HTML.SuiteView = (function(superClass) {
    var viewId;

    extend(SuiteView, superClass);

    viewId = 0;

    function SuiteView(suite, reporter) {
      this.suite = suite;
      this.reporter = reporter;
      this.views = this.reporter.views;
      this.suite.viewId = viewId += 1;
      this.views.suites[this.suite.viewId] = this;
      this.suite = new Teaspoon.Suite(this.suite);
      SuiteView.__super__.constructor.apply(this, arguments);
    }

    SuiteView.prototype.build = function() {
      SuiteView.__super__.build.call(this, "suite");
      this.el.innerHTML = "<h1><a href=\"" + this.suite.link + "\">" + (this.htmlSafe(this.suite.description)) + "</a></h1>";
      this.parentView = this.buildParent();
      return this.parentView.append(this.el);
    };

    SuiteView.prototype.buildParent = function() {
      var parent, view;
      parent = this.suite.parent;
      if (!parent) {
        return this.reporter;
      }
      if (parent.viewId) {
        return this.views.suites[parent.viewId];
      } else {
        view = new Teaspoon.Reporters.HTML.SuiteView(parent, this.reporter);
        return this.views.suites[view.suite.viewId] = view;
      }
    };

    SuiteView.prototype.append = function(el) {
      if (!this.ol) {
        SuiteView.__super__.append.call(this, this.ol = this.createEl("ol"));
      }
      return this.ol.appendChild(el);
    };

    SuiteView.prototype.updateState = function(state) {
      var base;
      if (this.state === "failed") {
        return;
      }
      this.el.className = (this.el.className.replace(/\s?state-\w+/, "")) + " state-" + state;
      if (typeof (base = this.parentView).updateState === "function") {
        base.updateState(state);
      }
      return this.state = state;
    };

    return SuiteView;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  Teaspoon.Reporters.HTML.template = function() {
    return "<div class=\"teaspoon-clearfix\">\n  <div id=\"teaspoon-title\">\n    <h1><a href=\"" + Teaspoon.root + "\" id=\"teaspoon-root-link\">Teaspoon</a></h1>\n    <ul>\n      <li>version: <b id=\"teaspoon-version\"></b></li>\n      <li id=\"teaspoon-env-info\"></li>\n    </ul>\n  </div>\n  <div id=\"teaspoon-progress\"></div>\n  <ul id=\"teaspoon-stats\">\n    <li>passes: <b id=\"teaspoon-stats-passes\">0</b></li>\n    <li>failures: <b id=\"teaspoon-stats-failures\">0</b></li>\n    <li>skipped: <b id=\"teaspoon-stats-skipped\">0</b></li>\n    <li>duration: <b id=\"teaspoon-stats-duration\">&infin;</b></li>\n  </ul>\n</div>\n\n<div id=\"teaspoon-controls\" class=\"teaspoon-clearfix\">\n  <div id=\"teaspoon-toggles\">\n    <button id=\"teaspoon-use-catch\" title=\"Toggle using try/catch wrappers when possible\">Try/Catch</button>\n    <button id=\"teaspoon-build-full-report\" title=\"Toggle building the full report\">Full Report</button>\n    <button id=\"teaspoon-display-progress\" title=\"Toggle displaying progress as tests run\">Progress</button>\n  </div>\n  <div id=\"teaspoon-suites\"></div>\n</div>\n\n<hr/>\n\n<div id=\"teaspoon-filter\">\n  <h1>Applied Filters [<a href=\"" + window.location.pathname + "\" id=\"teaspoon-filter-clear\">remove</a>]</h1>\n  <ul id=\"teaspoon-filter-list\"></ul>\n</div>\n\n<div id=\"teaspoon-report\">\n  <ol id=\"teaspoon-report-failures\"></ol>\n  <ol id=\"teaspoon-report-all\"></ol>\n</div>";
  };

}).call(this);
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Teaspoon.Reporters.Console = (function() {
    function Console() {
      this.reportRunnerResults = bind(this.reportRunnerResults, this);
      this.start = new Teaspoon.Date();
      this.suites = {};
    }

    Console.prototype.reportRunnerStarting = function(runner) {
      return this.log({
        type: "runner",
        total: runner.total || (typeof runner.specs === "function" ? runner.specs().length : void 0) || 0,
        start: JSON.parse(JSON.stringify(this.start))
      });
    };

    Console.prototype.reportSuites = function() {
      var i, index, len, ref, results, suite;
      ref = this.spec.getParents();
      results = [];
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        suite = ref[index];
        if (this.suites[suite.fullDescription]) {
          continue;
        }
        this.suites[suite.fullDescription] = true;
        results.push(this.log({
          type: "suite",
          label: suite.description,
          level: index
        }));
      }
      return results;
    };

    Console.prototype.reportSpecResults = function(spec) {
      var result;
      this.spec = new Teaspoon.Spec(spec);
      result = this.spec.result();
      if (result.skipped) {
        return;
      }
      this.reportSuites();
      switch (result.status) {
        case "pending":
          return this.trackPending();
        case "failed":
          return this.trackFailure();
        default:
          return this.log({
            type: "spec",
            suite: this.spec.suiteName,
            label: this.spec.description,
            status: result.status,
            skipped: result.skipped
          });
      }
    };

    Console.prototype.trackPending = function() {
      var result;
      result = this.spec.result();
      return this.log({
        type: "spec",
        suite: this.spec.suiteName,
        label: this.spec.description,
        status: result.status,
        skipped: result.skipped
      });
    };

    Console.prototype.trackFailure = function() {
      var error, i, len, ref, result, results;
      result = this.spec.result();
      ref = this.spec.errors();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        error = ref[i];
        results.push(this.log({
          type: "spec",
          suite: this.spec.suiteName,
          label: this.spec.description,
          status: result.status,
          skipped: result.skipped,
          link: this.spec.fullDescription,
          message: error.message,
          trace: error.stack || error.message || "Stack Trace Unavailable"
        }));
      }
      return results;
    };

    Console.prototype.reportRunnerResults = function() {
      this.log({
        type: "result",
        elapsed: ((new Teaspoon.Date().getTime() - this.start.getTime()) / 1000).toFixed(5),
        coverage: window.__coverage__
      });
      return Teaspoon.finished = true;
    };

    Console.prototype.log = function(obj) {
      if (obj == null) {
        obj = {};
      }
      obj["_teaspoon"] = true;
      return Teaspoon.log(JSON.stringify(obj));
    };

    return Console;

  })();

}).call(this);
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Teaspoon.Reporters.HTML = (function(superClass) {
    extend(HTML, superClass);

    function HTML() {
      return HTML.__super__.constructor.apply(this, arguments);
    }

    HTML.prototype.readConfig = function() {
      HTML.__super__.readConfig.apply(this, arguments);
      return jasmine.CATCH_EXCEPTIONS = this.config["use-catch"];
    };

    HTML.prototype.envInfo = function() {
      var ver, verString;
      ver = jasmine.getEnv().version();
      verString = [ver.major, ver.minor, ver.build].join(".");
      return "jasmine " + verString + " revision " + ver.revision;
    };

    return HTML;

  })(Teaspoon.Reporters.HTML);

}).call(this);
(function() {
  var env,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if (typeof jasmine === "undefined" || jasmine === null) {
    throw new Teaspoon.Error('Jasmine not found -- use `suite.use_framework :jasmine` and adjust or remove the `suite.javascripts` directive.');
  }

  Teaspoon.Runner = (function(superClass) {
    extend(Runner, superClass);

    function Runner() {
      Runner.__super__.constructor.apply(this, arguments);
      env.execute();
    }

    Runner.prototype.setup = function() {
      var grep, reporter;
      env.updateInterval = 1000;
      if (grep = this.params["grep"]) {
        env.specFilter = function(spec) {
          return spec.getFullName().indexOf(grep) === 0;
        };
      }
      reporter = new (this.getReporter())();
      env.addReporter(reporter);
      return this.addFixtureSupport();
    };

    Runner.prototype.addFixtureSupport = function() {
      if (!(jasmine.getFixtures && this.fixturePath)) {
        return;
      }
      jasmine.getFixtures().containerId = "teaspoon-fixtures";
      jasmine.getFixtures().fixturesPath = this.fixturePath;
      jasmine.getStyleFixtures().fixturesPath = this.fixturePath;
      return jasmine.getJSONFixtures().fixturesPath = this.fixturePath;
    };

    return Runner;

  })(Teaspoon.Runner);

  Teaspoon.Spec = (function() {
    function Spec(spec1) {
      this.spec = spec1;
      this.fullDescription = this.spec.getFullName();
      this.description = this.spec.description;
      this.link = "?grep=" + (encodeURIComponent(this.fullDescription));
      this.parent = this.spec.suite;
      this.suiteName = this.parent.getFullName();
      this.viewId = this.spec.viewId;
      this.pending = this.spec.pending;
    }

    Spec.prototype.errors = function() {
      var i, item, len, ref, results1;
      if (!this.spec.results) {
        return [];
      }
      ref = this.spec.results().getItems();
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (item.passed()) {
          continue;
        }
        results1.push({
          message: item.message,
          stack: item.trace.stack
        });
      }
      return results1;
    };

    Spec.prototype.getParents = function() {
      var parent;
      if (this.parents) {
        return this.parents;
      }
      this.parents || (this.parents = []);
      parent = this.parent;
      while (parent) {
        parent = new Teaspoon.Suite(parent);
        this.parents.unshift(parent);
        parent = parent.parent;
      }
      return this.parents;
    };

    Spec.prototype.result = function() {
      var results, status;
      results = this.spec.results();
      status = "failed";
      if (results.passed()) {
        status = "passed";
      }
      if (this.spec.pending) {
        status = "pending";
      }
      return {
        status: status,
        skipped: results.skipped
      };
    };

    return Spec;

  })();

  Teaspoon.Suite = (function() {
    function Suite(suite) {
      this.suite = suite;
      this.fullDescription = this.suite.getFullName();
      this.description = this.suite.description;
      this.link = "?grep=" + (encodeURIComponent(this.fullDescription));
      this.parent = this.suite.parentSuite;
      this.viewId = this.suite.viewId;
    }

    return Suite;

  })();

  Teaspoon.fixture = (function(superClass) {
    extend(fixture, superClass);

    function fixture() {
      return fixture.__super__.constructor.apply(this, arguments);
    }

    window.fixture = fixture;

    fixture.load = function() {
      var args;
      args = arguments;
      if (!(env.currentSuite || env.currentSpec)) {
        throw "Teaspoon can't load fixtures outside of describe.";
      }
      if (env.currentSuite) {
        env.beforeEach((function(_this) {
          return function() {
            return fixture.__super__.constructor.load.apply(_this, args);
          };
        })(this));
        env.afterEach((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.load.apply(this, arguments);
      } else {
        env.currentSpec.after((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.load.apply(this, arguments);
      }
    };

    fixture.set = function() {
      var args;
      args = arguments;
      if (!(env.currentSuite || env.currentSpec)) {
        throw "Teaspoon can't load fixtures outside of describe.";
      }
      if (env.currentSuite) {
        env.beforeEach((function(_this) {
          return function() {
            return fixture.__super__.constructor.set.apply(_this, args);
          };
        })(this));
        env.afterEach((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.set.apply(this, arguments);
      } else {
        env.currentSpec.after((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.set.apply(this, arguments);
      }
    };

    return fixture;

  })(Teaspoon.fixture);

  env = jasmine.getEnv();

}).call(this);
