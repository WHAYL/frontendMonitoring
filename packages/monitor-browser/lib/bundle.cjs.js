'use strict';

var MYSTORAGE_COUNT = 100;
var IMMEDIATE_REPORT_LEVEL = "ERROR";
var ReportLevelEnum;
(function (ReportLevelEnum) {
  ReportLevelEnum[ReportLevelEnum["ERROR"] = 0] = "ERROR";
  ReportLevelEnum[ReportLevelEnum["WARN"] = 1] = "WARN";
  ReportLevelEnum[ReportLevelEnum["INFO"] = 2] = "INFO";
  ReportLevelEnum[ReportLevelEnum["DEBUG"] = 3] = "DEBUG";
  ReportLevelEnum[ReportLevelEnum["OFF"] = 4] = "OFF";
})(ReportLevelEnum || (ReportLevelEnum = {}));
var FrontendMonitor = function () {
  function FrontendMonitor() {
    this.config = {
      reportLevel: IMMEDIATE_REPORT_LEVEL,
      enabled: true,
      maxStorageCount: MYSTORAGE_COUNT
    };
    this.storageQueue = [];
    this.fingerprint = '';
  }
  FrontendMonitor.prototype.init = function (config) {
    this.config = Object.assign(this.config, config);
  };
  FrontendMonitor.prototype.getFingerprint = function () {
    return this.fingerprint;
  };
  FrontendMonitor.prototype.log = function (pluginName, level, message, error, data) {
    if (!this.config.enabled) {
      return;
    }
    var timestamp = typeof performance !== 'undefined' ? Math.floor(performance.now() + performance.timeOrigin) : Date.now();
    var errorInfo = {
      level: level,
      message: message,
      timestamp: timestamp,
      url: typeof window !== 'undefined' ? window.location.href : '',
      pluginName: pluginName,
      fingerprint: this.fingerprint,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      data: data
    };
    if (ReportLevelEnum[level] <= ReportLevelEnum[this.config.reportLevel]) {
      this.report(errorInfo);
    } else {
      this.storeLocally(errorInfo);
    }
  };
  FrontendMonitor.prototype.error = function (pluginName, message, error, data) {
    this.log(pluginName, 'ERROR', message, error, data);
  };
  FrontendMonitor.prototype.warn = function (pluginName, message, error, data) {
    this.log(pluginName, 'WARN', message, error, data);
  };
  FrontendMonitor.prototype.info = function (pluginName, message, data) {
    this.log(pluginName, 'INFO', message, undefined, data);
  };
  FrontendMonitor.prototype.debug = function (pluginName, message, data) {
    this.log(pluginName, 'DEBUG', message, undefined, data);
  };
  FrontendMonitor.prototype.storeLocally = function (errorInfo) {
    this.storageQueue.unshift(errorInfo);
    if (this.storageQueue.length > (this.config.maxStorageCount || MYSTORAGE_COUNT)) {
      this.storageQueue.pop();
    }
  };
  FrontendMonitor.prototype.checkAndReportStored = function () {
    var _this = this;
    if (!this.config.enabled || this.storageQueue.length === 0) {
      return;
    }
    var reportableItems = this.storageQueue.filter(function (item) {
      return ReportLevelEnum[item.level] <= ReportLevelEnum[_this.config.reportLevel];
    });
    if (reportableItems.length > 0) {
      reportableItems.forEach(function (item) {
        return _this.report(item);
      });
      this.storageQueue = this.storageQueue.filter(function (item) {
        return ReportLevelEnum[item.level] > ReportLevelEnum[_this.config.reportLevel];
      });
    }
  };
  FrontendMonitor.prototype.updateReportLevel = function (level) {
    this.config.reportLevel = level;
    this.checkAndReportStored();
  };
  FrontendMonitor.prototype.report = function (errorInfo) {
    console.log("[Frontend Monitor] ".concat(errorInfo.level.toUpperCase(), ": ").concat(errorInfo.message), errorInfo);
  };
  FrontendMonitor.prototype.destroy = function () {
    this.storageQueue = [];
  };
  return FrontendMonitor;
}();
var monitor = new FrontendMonitor();

var XhrPlugin = (function () {
    function XhrPlugin() {
        this.name = 'xhr';
        this.monitor = null;
        this.xhrOpen = null;
        this.xhrSend = null;
        this.requests = new Map();
    }
    XhrPlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.setupXhrMonitoring();
    };
    XhrPlugin.prototype.destroy = function () {
        if (this.xhrOpen) {
            XMLHttpRequest.prototype.open = this.xhrOpen;
        }
        if (this.xhrSend) {
            XMLHttpRequest.prototype.send = this.xhrSend;
        }
        this.requests.clear();
    };
    XhrPlugin.prototype.setupXhrMonitoring = function () {
        var self = this;
        this.xhrOpen = XMLHttpRequest.prototype.open;
        this.xhrSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url) {
            self.requests.set(this, {
                startTime: Date.now(),
                method: method,
                url: url.toString()
            });
            return self.xhrOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function (body) {
            var requestInfo = self.requests.get(this);
            if (requestInfo) {
                requestInfo.data = body ? body.toString() : '';
            }
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && self.monitor) {
                    var endTime = Date.now();
                    var duration = endTime - ((requestInfo === null || requestInfo === void 0 ? void 0 : requestInfo.startTime) || endTime);
                    var xhrInfo = {
                        method: (requestInfo === null || requestInfo === void 0 ? void 0 : requestInfo.method) || 'UNKNOWN',
                        url: (requestInfo === null || requestInfo === void 0 ? void 0 : requestInfo.url) || 'UNKNOWN',
                        status: this.status,
                        duration: duration,
                        requestData: requestInfo === null || requestInfo === void 0 ? void 0 : requestInfo.data,
                        responseData: this.responseText
                    };
                    if (this.status >= 400) {
                        self.monitor.error(self.name, "XHR Error: ".concat(xhrInfo.method, " ").concat(xhrInfo.url, " - Status: ").concat(xhrInfo.status), undefined, xhrInfo);
                    }
                    else {
                        self.monitor.info(self.name, "XHR Success: ".concat(xhrInfo.method, " ").concat(xhrInfo.url, " - Status: ").concat(xhrInfo.status));
                    }
                    self.requests.delete(this);
                }
            });
            return self.xhrSend.apply(this, arguments);
        };
    };
    return XhrPlugin;
}());

var FetchPlugin = (function () {
    function FetchPlugin() {
        this.name = 'fetch';
        this.monitor = null;
        this.originalFetch = null;
    }
    FetchPlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.setupFetchMonitoring();
    };
    FetchPlugin.prototype.destroy = function () {
        if (this.originalFetch) {
            window.fetch = this.originalFetch;
        }
    };
    FetchPlugin.prototype.setupFetchMonitoring = function () {
        var self = this;
        this.originalFetch = window.fetch;
        window.fetch = function (input, init) {
            var startTime = Date.now();
            var url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
            var method = (init === null || init === void 0 ? void 0 : init.method) || (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET') || 'GET';
            return self.originalFetch.apply(this, arguments).then(function (response) {
                var endTime = Date.now();
                var duration = endTime - startTime;
                var fetchInfo = {
                    url: url,
                    method: method,
                    status: response.status,
                    duration: duration,
                    requestData: (init === null || init === void 0 ? void 0 : init.body) ? init.body.toString() : undefined
                };
                if (!response.ok) {
                    self.monitor.error(self.name, "Fetch Error: ".concat(fetchInfo.method, " ").concat(fetchInfo.url, " - Status: ").concat(fetchInfo.status), undefined, fetchInfo);
                }
                else {
                    self.monitor.info(self.name, "Fetch Success: ".concat(fetchInfo.method, " ").concat(fetchInfo.url, " - Status: ").concat(fetchInfo.status));
                }
                return response;
            }).catch(function (error) {
                self.monitor.error(self.name, "Fetch Exception: ".concat(method, " ").concat(url, " - Error: ").concat(error.message), error);
                throw error;
            });
        };
    };
    return FetchPlugin;
}());

var DomPlugin = (function () {
    function DomPlugin() {
        this.name = 'dom';
        this.monitor = null;
        this.resizeTimer = null;
        this.abortController = null;
    }
    DomPlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.setupDomMonitoring();
    };
    DomPlugin.prototype.destroy = function () {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        if (this.resizeTimer) {
            window.clearTimeout(this.resizeTimer);
            this.resizeTimer = null;
        }
        this.monitor = null;
    };
    DomPlugin.prototype.setupDomMonitoring = function () {
        var _this = this;
        this.abortController = new AbortController();
        var signal = this.abortController.signal;
        window.addEventListener('error', function (event) {
            _this.monitor.error(_this.name, "JavaScript Error: ".concat(event.message), event.error);
        }, { signal: signal });
        window.addEventListener('unhandledrejection', function (event) {
            _this.monitor.error(_this.name, "Unhandled Promise Rejection: ".concat(event.reason), typeof event.reason === 'string' ? new Error(event.reason) : event.reason);
        }, { signal: signal });
        var mouseEventHandler = function (eventType) { return function (event) {
            var target = event.target;
            var tagName = target.tagName;
            var id = target.id;
            var className = target.className;
            _this.monitor.debug(_this.name, "User Mouse Event (".concat(eventType, "): ").concat(tagName).concat(id ? '#' + id : '').concat(className ? '.' + className : ''), {
                target: target
            });
        }; };
        var mouseEvents = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'];
        mouseEvents.forEach(function (eventType) {
            document.addEventListener(eventType, mouseEventHandler(eventType), {
                capture: true,
                signal: signal
            });
        });
        window.addEventListener('resize', function () {
            if (_this.resizeTimer) {
                window.clearTimeout(_this.resizeTimer);
            }
            _this.resizeTimer = window.setTimeout(function () {
                var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
                _this.monitor.debug(_this.name, "Window Resize: ".concat(innerWidth, "x").concat(innerHeight));
            }, 500);
        }, { signal: signal });
    };
    return DomPlugin;
}());

var RoutePlugin = (function () {
    function RoutePlugin() {
        this.name = 'route';
        this.monitor = null;
        this.lastRoute = null;
        this.routeEnterTime = 0;
    }
    RoutePlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.setupRouteMonitoring();
    };
    RoutePlugin.prototype.destroy = function () {
        this.recordRouteLeave();
        window.removeEventListener('hashchange', this.handleHashChange);
        window.removeEventListener('popstate', this.handleHistoryChange);
    };
    RoutePlugin.prototype.setupRouteMonitoring = function () {
        this.lastRoute = this.getCurrentRoute();
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
        window.addEventListener('popstate', this.handleHistoryChange.bind(this));
        this.wrapHistoryMethods();
        this.recordRouteEnter();
        this.monitor.info(this.name, "Initial Route: ".concat(this.lastRoute), {
            route: this.lastRoute,
            enterTime: this.routeEnterTime
        });
    };
    RoutePlugin.prototype.handleHashChange = function () {
        this.handleRouteChange('hash');
    };
    RoutePlugin.prototype.handleHistoryChange = function () {
        this.handleRouteChange('history');
    };
    RoutePlugin.prototype.handleRouteChange = function (changeType) {
        var currentRoute = this.getCurrentRoute();
        if (this.lastRoute !== currentRoute) {
            this.recordRouteLeave();
            this.lastRoute = currentRoute;
            this.recordRouteEnter();
            this.monitor.info(this.name, "Route Changed (".concat(changeType, "): ").concat(this.lastRoute), {
                previousRoute: this.lastRoute,
                currentRoute: currentRoute,
                changeType: changeType,
                enterTime: this.routeEnterTime
            });
        }
    };
    RoutePlugin.prototype.getCurrentRoute = function () {
        return window.location.href;
    };
    RoutePlugin.prototype.wrapHistoryMethods = function () {
        var self = this;
        var originalPushState = history.pushState;
        var originalReplaceState = history.replaceState;
        history.pushState = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = originalPushState.apply(this, args);
            self.handleRouteChange('pushState');
            return result;
        };
        history.replaceState = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = originalReplaceState.apply(this, args);
            self.handleRouteChange('replaceState');
            return result;
        };
    };
    RoutePlugin.prototype.recordRouteEnter = function () {
        this.routeEnterTime = Date.now();
    };
    RoutePlugin.prototype.recordRouteLeave = function () {
        if (this.lastRoute && this.routeEnterTime) {
            var leaveTime = Date.now();
            var duration = leaveTime - this.routeEnterTime;
            this.monitor.info(this.name, "Route Left: ".concat(this.lastRoute), {
                route: this.lastRoute,
                enterTime: this.routeEnterTime,
                leaveTime: leaveTime,
                duration: duration
            });
        }
    };
    return RoutePlugin;
}());

var BrowserMonitor = (function () {
    function BrowserMonitor(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        this.plugins = [];
        var _a = config.pluginsUse || {}, _b = _a.xhrPluginEnabled, xhrPluginEnabled = _b === void 0 ? true : _b, _c = _a.fetchPluginEnabled, fetchPluginEnabled = _c === void 0 ? true : _c, _d = _a.domPluginEnabled, domPluginEnabled = _d === void 0 ? true : _d, _e = _a.routePluginEnabled, routePluginEnabled = _e === void 0 ? true : _e;
        monitor.init((config === null || config === void 0 ? void 0 : config.monitorConfig) || {});
        var pluginsToRegister = [
            xhrPluginEnabled && { name: 'XhrPlugin', creator: function () { return new XhrPlugin(); } },
            fetchPluginEnabled && { name: 'FetchPlugin', creator: function () { return new FetchPlugin(); } },
            domPluginEnabled && { name: 'DomPlugin', creator: function () { return new DomPlugin(); } },
            routePluginEnabled && { name: 'RoutePlugin', creator: function () { return new RoutePlugin(); } }
        ].filter(Boolean);
        pluginsToRegister.forEach(function (plugin) {
            _this.use(plugin.creator());
        });
    }
    BrowserMonitor.prototype.use = function (plugin) {
        var existingPlugin = this.plugins.find(function (p) { return p.name === plugin.name; });
        if (existingPlugin) {
            console.warn("Plugin ".concat(plugin.name, " already exists, skipping addition."));
            return;
        }
        this.plugins.push(plugin);
        plugin.init(monitor);
    };
    BrowserMonitor.prototype.destroy = function () {
        this.plugins.forEach(function (plugin) {
            if (plugin.destroy) {
                plugin.destroy();
            }
        });
        this.plugins = [];
    };
    return BrowserMonitor;
}());

module.exports = BrowserMonitor;
