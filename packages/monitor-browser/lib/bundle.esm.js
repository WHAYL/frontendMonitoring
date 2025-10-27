/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var __assign$1 = function () {
  __assign$1 = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: []
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

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

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var FrontendMonitor = function () {
  function FrontendMonitor() {
    this.config = {
      reportLevel: IMMEDIATE_REPORT_LEVEL,
      enabled: true,
      maxStorageCount: MYSTORAGE_COUNT,
      uploadHandler: null,
      platform: ''
    };
    this.storageQueue = [];
    this.removedItems = [];
    this.fingerprint = '';
    this.oldFingerprint = '';
  }
  FrontendMonitor.prototype.init = function (config) {
    var _a;
    this.config = Object.assign(this.config, config);
    this.fingerprint = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.fingerprint) || "";
  };
  FrontendMonitor.prototype.updateConfig = function (newConfig) {
    var oldConfig = __assign({}, this.config);
    this.config = Object.assign(this.config, newConfig);
    if (oldConfig.reportLevel !== this.config.reportLevel) {
      this.checkAndReportStored();
    }
    if (oldConfig.fingerprint !== this.config.fingerprint && this.config.fingerprint) {
      this.setFingerprint(this.config.fingerprint);
    }
  };
  FrontendMonitor.prototype.getFingerprint = function () {
    return this.fingerprint;
  };
  FrontendMonitor.prototype.setFingerprint = function (fingerprint) {
    this.oldFingerprint = this.fingerprint;
    this.fingerprint = fingerprint;
  };
  FrontendMonitor.prototype.log = function (info) {
    if (!this.config.enabled) {
      return;
    }
    var errorInfo = __assign(__assign({}, info), {
      fingerprint: this.fingerprint,
      oldFingerprint: this.oldFingerprint,
      platform: this.config.platform
    });
    if (ReportLevelEnum[info.level] <= ReportLevelEnum[this.config.reportLevel]) {
      this.report(errorInfo);
    } else {
      this.storageQueue.push(errorInfo);
      if (this.storageQueue.length > (this.config.maxStorageCount || MYSTORAGE_COUNT)) {
        var data = this.storageQueue.shift();
        if (data) {
          if (this.removedItems.length > (this.config.maxStorageCount || MYSTORAGE_COUNT) && this.removedItems.length) {
            this.report(this.removedItems);
            this.removedItems = [];
          }
          this.removedItems.push(data);
        }
      }
    }
  };
  FrontendMonitor.prototype.reportInfo = function (level, info) {
    this.log(__assign(__assign({}, info), {
      level: level
    }));
  };
  FrontendMonitor.prototype.checkAndReportStored = function () {
    var _this = this;
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
  FrontendMonitor.prototype.getStorageQueue = function () {
    return this.storageQueue;
  };
  FrontendMonitor.prototype.clearStorageQueue = function () {
    this.storageQueue = [];
  };
  FrontendMonitor.prototype.reportStorageQueue = function () {
    if (this.storageQueue.length > 0) {
      this.report(this.storageQueue);
      this.clearStorageQueue();
    }
  };
  FrontendMonitor.prototype.reportRemovedItems = function () {
    if (this.removedItems.length > 0) {
      this.report(this.removedItems);
      this.removedItems = [];
    }
  };
  FrontendMonitor.prototype.reportRestInfo = function () {
    this.reportStorageQueue();
    this.reportRemovedItems();
  };
  FrontendMonitor.prototype.report = function (errorInfo) {
    if (typeof this.config.uploadHandler === 'function') {
      try {
        this.config.uploadHandler(errorInfo);
      } catch (err) {
        console.error('[Frontend Monitor] Failed to send error report with custom handler:', err);
      }
    } else {
      console.log("[Frontend Monitor] : ".concat(JSON.stringify(errorInfo)));
    }
  };
  FrontendMonitor.prototype.destroy = function () {
    this.clearStorageQueue();
  };
  return FrontendMonitor;
}();

function getTimestamp() {
    return typeof performance !== 'undefined' && typeof performance.now === 'function' && typeof performance.timeOrigin === 'number'
        ? performance.now() + performance.timeOrigin
        : Date.now();
}
function formatTimestamp(format, timestamp) {
    if (format === void 0) { format = 'YYYY/MM/DD hh:mm:ss.SSS'; }
    var ts = typeof timestamp === 'number' ? timestamp : getTimestamp();
    var d = new Date(Math.floor(ts));
    var pad = function (n, len) {
        if (len === void 0) { len = 2; }
        return n.toString().padStart(len, '0');
    };
    var year = d.getFullYear().toString();
    var month = pad(d.getMonth() + 1);
    var day = pad(d.getDate());
    var hour = pad(d.getHours());
    var minute = pad(d.getMinutes());
    var second = pad(d.getSeconds());
    var ms = pad(d.getMilliseconds(), 3);
    return format
        .replace(/YYYY/g, year)
        .replace(/MM/g, month)
        .replace(/DD/g, day)
        .replace(/hh/g, hour)
        .replace(/mm/g, minute)
        .replace(/ss/g, second)
        .replace(/SSS/g, ms);
}

var XhrPlugin = (function () {
    function XhrPlugin() {
        this.name = 'xhr';
        this.monitor = null;
        this.xhrMap = new Map();
        this.abortController = null;
    }
    XhrPlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.abortController = new AbortController();
        this.setupXhrMonitoring();
    };
    XhrPlugin.prototype.setupXhrMonitoring = function () {
        var self = this;
        var originalOpen = XMLHttpRequest.prototype.open;
        var originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url) {
            this._xhrInfo = {
                method: method,
                url: url.toString(),
                startTime: getTimestamp()
            };
            self.xhrMap.set(this, this._xhrInfo);
            originalOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function () {
            var _a, _b;
            var xhrInfo = self.xhrMap.get(this);
            if (xhrInfo) {
                this.addEventListener('error', function () {
                    var endTime = getTimestamp();
                    var duration = endTime - xhrInfo.startTime;
                    var extraData = {
                        type: 'xhr',
                        url: xhrInfo.url,
                        method: xhrInfo.method,
                        error: 'Network Error',
                        startTime: xhrInfo.startTime,
                        endTime: endTime,
                        duration: duration
                    };
                    self.monitor.reportInfo('INFO', {
                        pluginName: self.name,
                        message: "XHR Error: ".concat(xhrInfo.method, " ").concat(xhrInfo.url),
                        url: window.location.href,
                        timestamp: getTimestamp(),
                        date: formatTimestamp(),
                        extraData: extraData
                    });
                    self.xhrMap.delete(this);
                }, {
                    signal: (_a = self.abortController) === null || _a === void 0 ? void 0 : _a.signal
                });
                this.addEventListener('timeout', function () {
                    var endTime = getTimestamp();
                    var duration = endTime - xhrInfo.startTime;
                    var extraData = {
                        type: 'xhr',
                        url: xhrInfo.url,
                        method: xhrInfo.method,
                        error: 'Timeout',
                        startTime: xhrInfo.startTime,
                        endTime: endTime,
                        duration: duration
                    };
                    self.monitor.reportInfo('INFO', {
                        pluginName: self.name,
                        message: "XHR Timeout: ".concat(xhrInfo.method, " ").concat(xhrInfo.url),
                        url: window.location.href,
                        timestamp: getTimestamp(),
                        date: formatTimestamp(),
                        extraData: extraData
                    });
                    self.xhrMap.delete(this);
                }, {
                    signal: (_b = self.abortController) === null || _b === void 0 ? void 0 : _b.signal
                });
            }
            originalSend.apply(this, arguments);
        };
    };
    XhrPlugin.prototype.destroy = function () {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.xhrMap.clear();
        this.monitor = null;
    };
    return XhrPlugin;
}());

var FetchPlugin = (function () {
    function FetchPlugin() {
        this.name = 'fetch';
        this.monitor = null;
    }
    FetchPlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.setupFetchMonitoring();
    };
    FetchPlugin.prototype.setupFetchMonitoring = function () {
        var originalFetch = window.fetch;
        var self = this;
        window.fetch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var startTime = getTimestamp();
            var url = typeof args[0] === 'string' ? args[0] : args[0].url;
            var method = 'GET';
            if (args[1] && args[1].method) {
                method = args[1].method;
            }
            return originalFetch.apply(this, args).then(function (response) {
                getTimestamp();
                return response;
            }).catch(function (error) {
                var endTime = getTimestamp();
                var duration = endTime - startTime;
                var extraData = {
                    type: 'fetch',
                    url: url,
                    method: method,
                    error: error.message,
                    stack: error.stack,
                    startTime: startTime,
                    endTime: endTime,
                    duration: duration
                };
                self.monitor.reportInfo('ERROR', {
                    pluginName: self.name,
                    message: "Fetch Error: ".concat(method, " ").concat(url, " - ").concat(error.message),
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
                throw error;
            });
        };
    };
    FetchPlugin.prototype.destroy = function () {
        this.monitor = null;
    };
    return FetchPlugin;
}());

function t$1(e, r, t, n) {
  return new (t || (t = Promise))(function (i, o) {
    function a(e) {
      try {
        c(n.next(e));
      } catch (e) {
        o(e);
      }
    }
    function u(e) {
      try {
        c(n.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function c(e) {
      var r;
      e.done ? i(e.value) : (r = e.value, r instanceof t ? r : new t(function (e) {
        e(r);
      })).then(a, u);
    }
    c((n = n.apply(e, [])).next());
  });
}
function n$1(e, r) {
  var t,
    n,
    i,
    o = {
      label: 0,
      sent: function () {
        if (1 & i[0]) throw i[1];
        return i[1];
      },
      trys: [],
      ops: []
    },
    a = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
  return a.next = u(0), a.throw = u(1), a.return = u(2), "function" == typeof Symbol && (a[Symbol.iterator] = function () {
    return this;
  }), a;
  function u(u) {
    return function (c) {
      return function (u) {
        if (t) throw new TypeError("Generator is already executing.");
        for (; a && (a = 0, u[0] && (o = 0)), o;) try {
          if (t = 1, n && (i = 2 & u[0] ? n.return : u[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, u[1])).done) return i;
          switch (n = 0, i && (u = [2 & u[0], i.value]), u[0]) {
            case 0:
            case 1:
              i = u;
              break;
            case 4:
              return o.label++, {
                value: u[1],
                done: !1
              };
            case 5:
              o.label++, n = u[1], u = [0];
              continue;
            case 7:
              u = o.ops.pop(), o.trys.pop();
              continue;
            default:
              if (!(i = o.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== u[0] && 2 !== u[0])) {
                o = 0;
                continue;
              }
              if (3 === u[0] && (!i || u[1] > i[0] && u[1] < i[3])) {
                o.label = u[1];
                break;
              }
              if (6 === u[0] && o.label < i[1]) {
                o.label = i[1], i = u;
                break;
              }
              if (i && o.label < i[2]) {
                o.label = i[2], o.ops.push(u);
                break;
              }
              i[2] && o.ops.pop(), o.trys.pop();
              continue;
          }
          u = r.call(e, o);
        } catch (e) {
          u = [6, e], n = 0;
        } finally {
          t = i = 0;
        }
        if (5 & u[0]) throw u[1];
        return {
          value: u[0] ? u[1] : void 0,
          done: true
        };
      }([u, c]);
    };
  }
}
function i$1(e) {
  var r = "function" == typeof Symbol && Symbol.iterator,
    t = r && e[r],
    n = 0;
  if (t) return t.call(e);
  if (e && "number" == typeof e.length) return {
    next: function () {
      return e && n >= e.length && (e = void 0), {
        value: e && e[n++],
        done: !e
      };
    }
  };
  throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function o$1(e, r) {
  var t = "function" == typeof Symbol && e[Symbol.iterator];
  if (!t) return e;
  var n,
    i,
    o = t.call(e),
    a = [];
  try {
    for (; (void 0 === r || r-- > 0) && !(n = o.next()).done;) a.push(n.value);
  } catch (e) {
    i = {
      error: e
    };
  } finally {
    try {
      n && !n.done && (t = o.return) && t.call(o);
    } finally {
      if (i) throw i.error;
    }
  }
  return a;
}
function a$1(e, r, t) {
  if (2 === arguments.length) for (var n, i = 0, o = r.length; i < o; i++) !n && i in r || (n || (n = Array.prototype.slice.call(r, 0, i)), n[i] = r[i]);
  return e.concat(n || Array.prototype.slice.call(r));
}
function u$1(e) {
  if (!Array.isArray(e)) throw new Error("EventEmitter(names:string[]):  names must be an array");
  var r = new Map(),
    t = function (r) {
      if (!e.includes(r)) throw new Error("Invalid event name: ".concat(r.toString(), ", must includes [").concat(e.toString(), "]"));
    },
    n = {
      getNames: function () {
        return e;
      },
      clearAll: function () {
        return r.clear();
      },
      on: function (e, n) {
        if (t(e), "function" != typeof n) throw new Error("on(eventName,listener) => listener: ".concat(n, ' for event "').concat(e.toString(), '" is not a function'));
        r.has(e) || r.set(e, new Set()), r.get(e).add(n);
      },
      off: function (e, n) {
        t(e);
        var i = r.get(e);
        i && (i.delete(n), 0 === i.size && r.delete(e));
      },
      emit: function (e) {
        for (var n = [], i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
        t(e);
        var u = r.get(e);
        u && u.forEach(function (r) {
          try {
            r.apply(void 0, a$1([], o$1(n), !1));
          } catch (r) {
            console.error('Error in listener for event "'.concat(e.toString(), '":'), r);
          }
        });
      }
    };
  return n;
}
"function" == typeof SuppressedError && SuppressedError, Function.prototype.after = function (e) {
  var r = this;
  return function () {
    for (var i = [], u = 0; u < arguments.length; u++) i[u] = arguments[u];
    return t$1(this, void 0, void 0, function () {
      var t;
      return n$1(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, Promise.resolve(r.apply(void 0, a$1([], o$1(i), false)))];
          case 1:
            return t = n.sent(), e(), [2, t];
        }
      });
    });
  };
}, Function.prototype.before = function (e) {
  var r = this;
  return function () {
    for (var i = [], u = 0; u < arguments.length; u++) i[u] = arguments[u];
    return t$1(this, void 0, void 0, function () {
      return n$1(this, function (t) {
        switch (t.label) {
          case 0:
            return e(), [4, Promise.resolve(r.apply(void 0, a$1([], o$1(i), false)))];
          case 1:
            return [2, t.sent()];
        }
      });
    });
  };
};
var c$1 = Object.prototype.toString;
function l$1(e) {
  return function (r) {
    return c$1.call(r) === "[object ".concat(e, "]");
  };
}
var s$1 = {
    isNumber: l$1("Number"),
    isString: l$1("String"),
    isBoolean: l$1("Boolean"),
    isNull: l$1("Null"),
    isUndefined: l$1("Undefined"),
    isSymbol: l$1("Symbol"),
    isFunction: l$1("Function"),
    isAsyncFunction: l$1("AsyncFunction"),
    isGeneratorFunction: l$1("GeneratorFunction"),
    isAsyncGeneratorFunction: l$1("AsyncGeneratorFunction"),
    isObject: l$1("Object"),
    isArray: function (e) {
      return Array.isArray(e);
    },
    isProcess: l$1("process"),
    isWindow: l$1("Window"),
    isDate: l$1("Date"),
    isMap: l$1("Map"),
    isSet: l$1("Set"),
    isWeakMap: l$1("WeakMap"),
    isWeakSet: l$1("WeakSet"),
    isPromise: l$1("Promise"),
    isNumNotNaN: function (e) {
      return "number" == typeof e && !isNaN(e);
    },
    isOth: function (e, r) {
      return l$1(r)(e);
    }
  };
var g$1 = function (e, r, i, o) {
    var a, u;
    return void 0 === r && (r = 200), "function" != typeof e ? (console.error("debounce ==> 参数1不是Function "), function () {}) : s$1.isNumNotNaN(r) ? function () {
      var c = this,
        l = this,
        s = arguments;
      return new Promise(function (f, v) {
        function d() {
          return t$1(this, void 0, void 0, function () {
            var r, t;
            return n$1(this, function (n) {
              switch (n.label) {
                case 0:
                  return n.trys.push([0, 2,, 3]), [4, e.apply(l, s)];
                case 1:
                  return r = n.sent(), f(r), [3, 3];
                case 2:
                  return t = n.sent(), v(t), [3, 3];
                case 3:
                  return [2];
              }
            });
          });
        }
        if (a && clearTimeout(a), i) {
          var h = !a;
          (clearTimeout(u), u = setTimeout(function () {
            return t$1(c, void 0, void 0, function () {
              return n$1(this, function (e) {
                return d(), [2];
              });
            });
          }, r || 0)), a = setTimeout(function () {
            a = null;
          }, r || 0), h && (d(), clearTimeout(u));
        }
      });
    } : (console.error("debounce ==> 参数2不是Number(!NaN)"), e);
  };
var I$1 = "__lodash_hash_undefined__",
  k$1 = 9007199254740991,
  F$1 = "[object Arguments]",
  W = "[object Boolean]",
  C$1 = "[object Date]",
  $$1 = "[object Function]",
  V = "[object GeneratorFunction]",
  K = "[object Map]",
  B$1 = "[object Number]",
  R = "[object Object]",
  q$1 = "[object Promise]",
  L$1 = "[object RegExp]",
  H$1 = "[object Set]",
  U = "[object String]",
  z = "[object Symbol]",
  G = "[object WeakMap]",
  X = "[object ArrayBuffer]",
  Y = "[object DataView]",
  J = "[object Float32Array]",
  Z = "[object Float64Array]",
  Q = "[object Int8Array]",
  ee = "[object Int16Array]",
  re = "[object Int32Array]",
  te = "[object Uint8Array]",
  ne = "[object Uint8ClampedArray]",
  ie = "[object Uint16Array]",
  oe = "[object Uint32Array]",
  ae = /\w*$/,
  ue = /^\[object .+?Constructor\]$/,
  ce = /^(?:0|[1-9]\d*)$/,
  le = {};
le[F$1] = le["[object Array]"] = le[X] = le[Y] = le[W] = le[C$1] = le[J] = le[Z] = le[Q] = le[ee] = le[re] = le[K] = le[B$1] = le[R] = le[L$1] = le[H$1] = le[U] = le[z] = le[te] = le[ne] = le[ie] = le[oe] = true, le["[object Error]"] = le[$$1] = le[G] = false;
var se = "object" == typeof global && global && global.Object === Object && global,
  fe = "object" == typeof self && self && self.Object === Object && self,
  ve = se || fe || Function("return this")(),
  de = "object" == typeof exports && exports && !exports.nodeType && exports,
  he = de && "object" == typeof module && module && !module.nodeType && module,
  pe = he && he.exports === de;
function ye(e, r) {
  return e.set(r[0], r[1]), e;
}
function ge(e, r) {
  return e.add(r), e;
}
function me(e, r, t, n) {
  for (var i = -1, o = e ? e.length : 0; ++i < o;) t = r(t, e[i], i, e);
  return t;
}
function we(e) {
  var r = false;
  if (null != e && "function" != typeof e.toString) try {
    r = !!(e + "");
  } catch (e) {}
  return r;
}
function be(e) {
  var r = -1,
    t = Array(e.size);
  return e.forEach(function (e, n) {
    t[++r] = [n, e];
  }), t;
}
function _e(e, r) {
  return function (t) {
    return e(r(t));
  };
}
function Ne(e) {
  var r = -1,
    t = Array(e.size);
  return e.forEach(function (e) {
    t[++r] = e;
  }), t;
}
var Ae,
  Se = Array.prototype,
  Ee = Function.prototype,
  Me = Object.prototype,
  je = ve["__core-js_shared__"],
  Te = (Ae = /[^.]+$/.exec(je && je.keys && je.keys.IE_PROTO || "")) ? "Symbol(src)_1." + Ae : "",
  xe = Ee.toString,
  Oe = Me.hasOwnProperty,
  Pe = Me.toString,
  De = RegExp("^" + xe.call(Oe).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
  Ie = pe ? ve.Buffer : void 0,
  ke = ve.Symbol,
  Fe = ve.Uint8Array,
  We = _e(Object.getPrototypeOf, Object),
  Ce = Object.create,
  $e = Me.propertyIsEnumerable,
  Ve = Se.splice,
  Ke = Object.getOwnPropertySymbols,
  Be = Ie ? Ie.isBuffer : void 0,
  Re = _e(Object.keys, Object),
  qe = hr(ve, "DataView"),
  Le = hr(ve, "Map"),
  He = hr(ve, "Promise"),
  Ue = hr(ve, "Set"),
  ze = hr(ve, "WeakMap"),
  Ge = hr(Object, "create"),
  Xe = wr(qe),
  Ye = wr(Le),
  Je = wr(He),
  Ze = wr(Ue),
  Qe = wr(ze),
  er = ke ? ke.prototype : void 0,
  rr = er ? er.valueOf : void 0;
function tr(e) {
  var r = -1,
    t = e ? e.length : 0;
  for (this.clear(); ++r < t;) {
    var n = e[r];
    this.set(n[0], n[1]);
  }
}
function nr(e) {
  var r = -1,
    t = e ? e.length : 0;
  for (this.clear(); ++r < t;) {
    var n = e[r];
    this.set(n[0], n[1]);
  }
}
function ir(e) {
  var r = -1,
    t = e ? e.length : 0;
  for (this.clear(); ++r < t;) {
    var n = e[r];
    this.set(n[0], n[1]);
  }
}
function or(e) {
  this.__data__ = new nr(e);
}
function ar(e, r) {
  var t = _r(e) || function (e) {
      return function (e) {
        return function (e) {
          return !!e && "object" == typeof e;
        }(e) && Nr(e);
      }(e) && Oe.call(e, "callee") && (!$e.call(e, "callee") || Pe.call(e) == F$1);
    }(e) ? function (e, r) {
      for (var t = -1, n = Array(e); ++t < e;) n[t] = r(t);
      return n;
    }(e.length, String) : [],
    n = t.length,
    i = !!n;
  for (var o in e) !Oe.call(e, o) || i && ("length" == o || gr(o, n)) || t.push(o);
  return t;
}
function ur(e, r, t) {
  var n = e[r];
  Oe.call(e, r) && br(n, t) && (void 0 !== t || r in e) || (e[r] = t);
}
function cr(e, r) {
  for (var t = e.length; t--;) if (br(e[t][0], r)) return t;
  return -1;
}
function lr(e, r, t, n, i, o, a) {
  var u;
  if (n && (u = o ? n(e, i, o, a) : n(e)), void 0 !== u) return u;
  if (!Er(e)) return e;
  var c = _r(e);
  if (c) {
    if (u = function (e) {
      var r = e.length,
        t = e.constructor(r);
      r && "string" == typeof e[0] && Oe.call(e, "index") && (t.index = e.index, t.input = e.input);
      return t;
    }(e), !r) return function (e, r) {
      var t = -1,
        n = e.length;
      r || (r = Array(n));
      for (; ++t < n;) r[t] = e[t];
      return r;
    }(e, u);
  } else {
    var l = yr(e),
      s = l == $$1 || l == V;
    if (Ar(e)) return function (e, r) {
      if (r) return e.slice();
      var t = new e.constructor(e.length);
      return e.copy(t), t;
    }(e, r);
    if (l == R || l == F$1 || s && !o) {
      if (we(e)) return o ? e : {};
      if (u = function (e) {
        return "function" != typeof e.constructor || mr(e) ? {} : (r = We(e), Er(r) ? Ce(r) : {});
        var r;
      }(s ? {} : e), !r) return function (e, r) {
        return vr(e, pr(e), r);
      }(e, function (e, r) {
        return e && vr(r, Mr(r), e);
      }(u, e));
    } else {
      if (!le[l]) return o ? e : {};
      u = function (e, r, t, n) {
        var i = e.constructor;
        switch (r) {
          case X:
            return fr(e);
          case W:
          case C$1:
            return new i(+e);
          case Y:
            return function (e, r) {
              var t = r ? fr(e.buffer) : e.buffer;
              return new e.constructor(t, e.byteOffset, e.byteLength);
            }(e, n);
          case J:
          case Z:
          case Q:
          case ee:
          case re:
          case te:
          case ne:
          case ie:
          case oe:
            return function (e, r) {
              var t = r ? fr(e.buffer) : e.buffer;
              return new e.constructor(t, e.byteOffset, e.length);
            }(e, n);
          case K:
            return function (e, r, t) {
              var n = r ? t(be(e), true) : be(e);
              return me(n, ye, new e.constructor());
            }(e, n, t);
          case B$1:
          case U:
            return new i(e);
          case L$1:
            return function (e) {
              var r = new e.constructor(e.source, ae.exec(e));
              return r.lastIndex = e.lastIndex, r;
            }(e);
          case H$1:
            return function (e, r, t) {
              var n = r ? t(Ne(e), true) : Ne(e);
              return me(n, ge, new e.constructor());
            }(e, n, t);
          case z:
            return o = e, rr ? Object(rr.call(o)) : {};
        }
        var o;
      }(e, l, lr, r);
    }
  }
  a || (a = new or());
  var f = a.get(e);
  if (f) return f;
  if (a.set(e, u), !c) var v = t ? function (e) {
    return function (e, r, t) {
      var n = r(e);
      return _r(e) ? n : function (e, r) {
        for (var t = -1, n = r.length, i = e.length; ++t < n;) e[i + t] = r[t];
        return e;
      }(n, t(e));
    }(e, Mr, pr);
  }(e) : Mr(e);
  return function (e, r) {
    for (var t = -1, n = e ? e.length : 0; ++t < n && false !== r(e[t], t, e););
  }(v || e, function (i, o) {
    v && (i = e[o = i]), ur(u, o, lr(i, r, t, n, o, e, a));
  }), u;
}
function sr(e) {
  return !(!Er(e) || (r = e, Te && Te in r)) && (Sr(e) || we(e) ? De : ue).test(wr(e));
  var r;
}
function fr(e) {
  var r = new e.constructor(e.byteLength);
  return new Fe(r).set(new Fe(e)), r;
}
function vr(e, r, t, n) {
  t || (t = {});
  for (var i = -1, o = r.length; ++i < o;) {
    var a = r[i];
    ur(t, a, e[a]);
  }
  return t;
}
function dr(e, r) {
  var t,
    n,
    i = e.__data__;
  return ("string" == (n = typeof (t = r)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== t : null === t) ? i["string" == typeof r ? "string" : "hash"] : i.map;
}
function hr(e, r) {
  var t = function (e, r) {
    return null == e ? void 0 : e[r];
  }(e, r);
  return sr(t) ? t : void 0;
}
tr.prototype.clear = function () {
  this.__data__ = Ge ? Ge(null) : {};
}, tr.prototype.delete = function (e) {
  return this.has(e) && delete this.__data__[e];
}, tr.prototype.get = function (e) {
  var r = this.__data__;
  if (Ge) {
    var t = r[e];
    return t === I$1 ? void 0 : t;
  }
  return Oe.call(r, e) ? r[e] : void 0;
}, tr.prototype.has = function (e) {
  var r = this.__data__;
  return Ge ? void 0 !== r[e] : Oe.call(r, e);
}, tr.prototype.set = function (e, r) {
  return this.__data__[e] = Ge && void 0 === r ? I$1 : r, this;
}, nr.prototype.clear = function () {
  this.__data__ = [];
}, nr.prototype.delete = function (e) {
  var r = this.__data__,
    t = cr(r, e);
  return !(t < 0) && (t == r.length - 1 ? r.pop() : Ve.call(r, t, 1), true);
}, nr.prototype.get = function (e) {
  var r = this.__data__,
    t = cr(r, e);
  return t < 0 ? void 0 : r[t][1];
}, nr.prototype.has = function (e) {
  return cr(this.__data__, e) > -1;
}, nr.prototype.set = function (e, r) {
  var t = this.__data__,
    n = cr(t, e);
  return n < 0 ? t.push([e, r]) : t[n][1] = r, this;
}, ir.prototype.clear = function () {
  this.__data__ = {
    hash: new tr(),
    map: new (Le || nr)(),
    string: new tr()
  };
}, ir.prototype.delete = function (e) {
  return dr(this, e).delete(e);
}, ir.prototype.get = function (e) {
  return dr(this, e).get(e);
}, ir.prototype.has = function (e) {
  return dr(this, e).has(e);
}, ir.prototype.set = function (e, r) {
  return dr(this, e).set(e, r), this;
}, or.prototype.clear = function () {
  this.__data__ = new nr();
}, or.prototype.delete = function (e) {
  return this.__data__.delete(e);
}, or.prototype.get = function (e) {
  return this.__data__.get(e);
}, or.prototype.has = function (e) {
  return this.__data__.has(e);
}, or.prototype.set = function (e, r) {
  var t = this.__data__;
  if (t instanceof nr) {
    var n = t.__data__;
    if (!Le || n.length < 199) return n.push([e, r]), this;
    t = this.__data__ = new ir(n);
  }
  return t.set(e, r), this;
};
var pr = Ke ? _e(Ke, Object) : function () {
    return [];
  },
  yr = function (e) {
    return Pe.call(e);
  };
function gr(e, r) {
  return !!(r = null == r ? k$1 : r) && ("number" == typeof e || ce.test(e)) && e > -1 && e % 1 == 0 && e < r;
}
function mr(e) {
  var r = e && e.constructor;
  return e === ("function" == typeof r && r.prototype || Me);
}
function wr(e) {
  if (null != e) {
    try {
      return xe.call(e);
    } catch (e) {}
    try {
      return e + "";
    } catch (e) {}
  }
  return "";
}
function br(e, r) {
  return e === r || e != e && r != r;
}
(qe && yr(new qe(new ArrayBuffer(1))) != Y || Le && yr(new Le()) != K || He && yr(He.resolve()) != q$1 || Ue && yr(new Ue()) != H$1 || ze && yr(new ze()) != G) && (yr = function (e) {
  var r = Pe.call(e),
    t = r == R ? e.constructor : void 0,
    n = t ? wr(t) : void 0;
  if (n) switch (n) {
    case Xe:
      return Y;
    case Ye:
      return K;
    case Je:
      return q$1;
    case Ze:
      return H$1;
    case Qe:
      return G;
  }
  return r;
});
var _r = Array.isArray;
function Nr(e) {
  return null != e && function (e) {
    return "number" == typeof e && e > -1 && e % 1 == 0 && e <= k$1;
  }(e.length) && !Sr(e);
}
var Ar = Be || function () {
  return false;
};
function Sr(e) {
  var r = Er(e) ? Pe.call(e) : "";
  return r == $$1 || r == V;
}
function Er(e) {
  var r = typeof e;
  return !!e && ("object" == r || "function" == r);
}
function Mr(e) {
  return Nr(e) ? ar(e) : function (e) {
    if (!mr(e)) return Re(e);
    var r = [];
    for (var t in Object(e)) Oe.call(e, t) && "constructor" != t && r.push(t);
    return r;
  }(e);
}
var jr = function (e) {
  return lr(e, true, true);
};
function Or(e, r, t, n, i, o) {
  o = void 0 !== o && o, n = void 0 === n || o, Object.defineProperty(e, r, {
    value: t,
    enumerable: false,
    writable: n,
    configurable: o
  });
}
var Pr,
  Dr = Array.prototype,
  Ir = Object.create(Dr),
  kr = "undefined" != typeof Proxy && "function" == typeof (Pr = Proxy) && /native code/.test(Pr.toString()),
  Wr = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];
Wr.forEach(function (e) {
  var r = Dr[e];
  Or(Ir, e, function () {
    for (var t, n, o, a, u, c, l, s, f, v, d, h, p, y, g, m, w, b, _, N, A = [], S = arguments.length; S--;) A[S] = arguments[S];
    var E = jr(this),
      M = r.apply(this, A);
    if (this.__obc__) if (["push", "pop"].includes(e) && !kr) {
      var j = this.__obc__.csKeyMap.get(this),
        T = (null == j ? void 0 : j.labelKey) + "." + (null == j ? void 0 : j.key) + ((null == j ? void 0 : j.key) ? "." : "");
      try {
        for (var x = i$1(this.__obc__.myWaMap), O = x.next(); !O.done; O = x.next()) {
          var P = O.value;
          T.startsWith(P[0]) && ((null === (c = null === (u = P[1]) || void 0 === u ? void 0 : u.props) || void 0 === c ? void 0 : c.run) && this.__obc__.refreshDeps && this.__obc__.runPub(), (null === (s = null === (l = P[1]) || void 0 === l ? void 0 : l.props) || void 0 === s ? void 0 : s.deep) ? !(null === (v = null === (f = P[1]) || void 0 === f ? void 0 : f.props) || void 0 === v ? void 0 : v.run) && P[1].fun(this, E) : !(null === (h = null === (d = P[1]) || void 0 === d ? void 0 : d.props) || void 0 === h ? void 0 : h.run) && T === P[0] && P[1].fun(this, E));
        }
      } catch (e) {
        t = {
          error: e
        };
      } finally {
        try {
          O && !O.done && (n = x.return) && n.call(x);
        } finally {
          if (t) throw t.error;
        }
      }
    } else try {
      for (var D = i$1(this.__obc__.myWaMap), I = D.next(); !I.done; I = D.next()) {
        P = I.value;
        this.__obc__.currKey.value.startsWith(P[0]) && ((null === (y = null === (p = P[1]) || void 0 === p ? void 0 : p.props) || void 0 === y ? void 0 : y.run) && this.__obc__.refreshDeps && this.__obc__.runPub(), (null === (m = null === (g = P[1]) || void 0 === g ? void 0 : g.props) || void 0 === m ? void 0 : m.deep) ? !(null === (b = null === (w = P[1]) || void 0 === w ? void 0 : w.props) || void 0 === b ? void 0 : b.run) && P[1].fun(this, E) : !(null === (N = null === (_ = P[1]) || void 0 === _ ? void 0 : _.props) || void 0 === N ? void 0 : N.run) && this.__obc__.currKey.value === P[0] && P[1].fun(this, E));
      }
    } catch (e) {
      o = {
        error: e
      };
    } finally {
      try {
        I && !I.done && (a = D.return) && a.call(D);
      } finally {
        if (o) throw o.error;
      }
    }
    return M;
  });
});

var DomPlugin = (function () {
    function DomPlugin(config) {
        if (config === void 0) { config = {}; }
        this.name = 'dom';
        this.monitor = null;
        this.abortController = null;
        this.config = __assign$1({ error: true, unhandledrejection: true, resize: true, clickPath: true }, config);
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
        this.monitor = null;
    };
    DomPlugin.prototype.setupDomMonitoring = function () {
        var _this = this;
        this.abortController = new AbortController();
        var signal = this.abortController.signal;
        this.config.error && window.addEventListener('error', function (event) {
            var extraData = {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
            };
            _this.monitor.reportInfo('ERROR', {
                pluginName: _this.name,
                message: "JavaScript Error: ".concat(event.message),
                url: window.location.href,
                extraData: extraData,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        }, { signal: signal });
        this.config.unhandledrejection && window.addEventListener('unhandledrejection', function (event) {
            var _a, _b, _c;
            var extraData = {
                type: event.type,
                promise: event.promise,
                reason: event.reason,
                reasonType: typeof event.reason,
                isError: event.reason instanceof Error,
                errorMessage: (_a = event.reason) === null || _a === void 0 ? void 0 : _a.message,
                errorStack: (_b = event.reason) === null || _b === void 0 ? void 0 : _b.stack,
                errorName: (_c = event.reason) === null || _c === void 0 ? void 0 : _c.name,
            };
            _this.monitor.reportInfo('ERROR', {
                pluginName: _this.name,
                message: "Unhandled Promise Rejection: ".concat(event.reason),
                url: window.location.href,
                extraData: extraData,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        }, { signal: signal });
        var mouseEventHandler = function (eventType) { return function (event) {
            if (!_this.config.mouseEvents || !_this.config.mouseEvents[eventType]) {
                return;
            }
            var cfg = _this.config.mouseEvents[eventType];
            var rawTarget = event.target;
            if (!rawTarget) {
                return;
            }
            var reportEl = null;
            if (cfg === true) {
                reportEl = rawTarget;
            }
            else {
                var candidates = cfg;
                var path = typeof event.composedPath === 'function' ? event.composedPath() : null;
                if (path && path.length) {
                    outer: for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                        var node = path_1[_i];
                        if (!(node instanceof HTMLElement)) {
                            continue;
                        }
                        for (var _a = 0, candidates_1 = candidates; _a < candidates_1.length; _a++) {
                            var cand = candidates_1[_a];
                            var isSelector = /^(\.|#|\[|[^a-zA-Z0-9_\-])/.test(cand) || /\s|>|\[/.test(cand);
                            try {
                                if (isSelector) {
                                    if (node.matches && node.matches(cand)) {
                                        reportEl = node;
                                        break outer;
                                    }
                                }
                                else {
                                    if (node.classList && node.classList.contains(cand)) {
                                        reportEl = node;
                                        break outer;
                                    }
                                }
                            }
                            catch (e) {
                            }
                        }
                    }
                }
                if (!reportEl) {
                    for (var _b = 0, candidates_2 = candidates; _b < candidates_2.length; _b++) {
                        var cand = candidates_2[_b];
                        var isSelector = /^(\.|#|\[|[^a-zA-Z0-9_\-])/.test(cand) || /\s|>|\[/.test(cand);
                        try {
                            var selector = isSelector ? cand : ".".concat(cand);
                            var found = rawTarget.closest(selector);
                            if (found) {
                                reportEl = found;
                                break;
                            }
                        }
                        catch (e) {
                        }
                    }
                }
            }
            if (!reportEl) {
                return;
            }
            var extraData = {
                localName: reportEl.localName,
                classList: Array.from(reportEl.classList).join(','),
                className: reportEl.className,
                id: reportEl.id,
                nodeName: reportEl.nodeName,
                tagName: reportEl.tagName,
                dataSet: Object.entries(reportEl.dataset).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return "".concat(key, ":").concat(value);
                }).join(','),
            };
            _this.monitor.reportInfo('DEBUG', {
                pluginName: _this.name,
                message: "User Mouse Event (".concat(eventType, "): ").concat(reportEl.tagName).concat(reportEl.id ? '#' + reportEl.id : '').concat(reportEl.className ? '.' + reportEl.className : ''),
                extraData: extraData,
                url: window.location.href,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        }; };
        if (this.config.mouseEvents && Object.keys(this.config.mouseEvents).length > 0) {
            Object.keys(this.config.mouseEvents).forEach(function (eventType) {
                document.addEventListener(eventType, g$1(mouseEventHandler(eventType), 1000, true), {
                    capture: true,
                    signal: signal
                });
            });
        }
        if (this.config.clickPath) {
            try {
                document.addEventListener('click', function (e) { return _this.handleClickPath(e); }, { capture: true, signal: signal });
            }
            catch (e) {
            }
        }
        this.config.resize && window.addEventListener('resize', g$1(function () {
            var _a;
            var innerWidth = window.innerWidth, innerHeight = window.innerHeight;
            var devicePixelRatio = window.devicePixelRatio || 1;
            var extraData = {
                innerWidth: innerWidth,
                innerHeight: innerHeight,
                devicePixelRatio: devicePixelRatio
            };
            (_a = _this.monitor) === null || _a === void 0 ? void 0 : _a.reportInfo('DEBUG', {
                pluginName: _this.name,
                message: "Window Resize: ".concat(innerWidth, "x").concat(innerHeight),
                url: window.location.href,
                extraData: extraData,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        }, 500, true), { signal: signal });
    };
    DomPlugin.prototype.describeElement = function (el) {
        if (!el) {
            return null;
        }
        return {
            tagName: el.tagName,
            id: el.id || null,
            className: el.className || null,
            localName: el.localName || null,
            dataset: Object.entries(el.dataset || {}).map(function (_a) {
                var k = _a[0], v = _a[1];
                return "".concat(k, ":").concat(v);
            }).join(',') || null,
        };
    };
    DomPlugin.prototype.buildPathFromEvent = function (event) {
        var path = [];
        var composed = event.composedPath ? event.composedPath() : null;
        if (composed && composed.length) {
            for (var _i = 0, composed_1 = composed; _i < composed_1.length; _i++) {
                var node = composed_1[_i];
                if (node instanceof HTMLElement) {
                    var desc = this.describeElement(node);
                    if (desc) {
                        path.push(desc);
                    }
                }
            }
        }
        else {
            var node = event.target;
            while (node) {
                var desc = this.describeElement(node);
                if (desc) {
                    path.push(desc);
                }
                node = node.parentElement;
            }
        }
        return path;
    };
    DomPlugin.prototype.handleClickPath = function (event) {
        try {
            if (!this.monitor) {
                return;
            }
            var path = this.buildPathFromEvent(event);
            var extraData = {
                timestamp: getTimestamp(),
                path: path,
                x: event.clientX,
                y: event.clientY,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                url: typeof window !== 'undefined' ? window.location.href : '',
            };
            this.monitor.reportInfo('INFO', {
                pluginName: this.name,
                message: 'click_path',
                extraData: extraData,
                url: window.location.href,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        }
        catch (e) {
        }
    };
    return DomPlugin;
}());

var arr = ['monitorRouteChange'];
var monitorRouteChange = u$1(arr);

var RoutePlugin = (function () {
    function RoutePlugin() {
        var _this = this;
        this.name = 'route';
        this.routeEnterTime = 0;
        this.abortController = null;
        this.handleDocumentClick = function (ev) {
            try {
                var target = ev.target;
                if (!target || !(target instanceof Element)) {
                    return;
                }
                var a = target.closest('a');
                if (!a) {
                    return;
                }
                var href = a.href;
                if (!href) {
                    return;
                }
                var extraData = {
                    previousRoute: _this.lastRoute,
                    currentRoute: href,
                    changeType: 'a.click',
                    enterTime: getTimestamp(),
                    target: a.target
                };
                _this.monitor.reportInfo('INFO', {
                    pluginName: _this.name,
                    message: "A tag clicked -> ".concat(href),
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
                monitorRouteChange.emit('monitorRouteChange', extraData);
            }
            catch (e) {
            }
        };
        this.handleBeforeUnload = function () {
            try {
                _this.recordRouteLeave();
            }
            catch (e) {
            }
        };
    }
    RoutePlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.abortController = new AbortController();
        this.setupRouteMonitoring();
    };
    RoutePlugin.prototype.destroy = function () {
        this.recordRouteLeave();
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        if (this.originalWindowOpen) {
            try {
                window.open = this.originalWindowOpen;
            }
            catch (e) { }
        }
        if (this.originalPushState) {
            try {
                history.pushState = this.originalPushState;
            }
            catch (e) { }
        }
        if (this.originalReplaceState) {
            try {
                history.replaceState = this.originalReplaceState;
            }
            catch (e) { }
        }
        this.monitor = null;
    };
    RoutePlugin.prototype.setupRouteMonitoring = function () {
        var _this = this;
        var _a, _b, _c, _d;
        this.lastRoute = this.getCurrentRoute();
        window.addEventListener('hashchange', function () {
            _this.handleRouteChange('hash');
        }, { signal: (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.signal });
        window.addEventListener('popstate', function () {
            _this.handleRouteChange('history');
        }, { signal: (_b = this.abortController) === null || _b === void 0 ? void 0 : _b.signal });
        this.wrapHistoryMethods();
        document.addEventListener('click', this.handleDocumentClick, { capture: true, signal: (_c = this.abortController) === null || _c === void 0 ? void 0 : _c.signal });
        this.wrapWindowOpen();
        window.addEventListener('beforeunload', this.handleBeforeUnload, { signal: (_d = this.abortController) === null || _d === void 0 ? void 0 : _d.signal });
        this.recordRouteEnter();
        var extraData = {
            route: this.lastRoute,
            enterTime: this.routeEnterTime
        };
        this.monitor.reportInfo('INFO', {
            pluginName: this.name,
            message: "Initial Route: ".concat(this.lastRoute),
            extraData: extraData,
            url: window.location.href,
            timestamp: getTimestamp(),
            date: formatTimestamp()
        });
    };
    RoutePlugin.prototype.handleRouteChange = function (changeType) {
        var currentRoute = this.getCurrentRoute();
        if (this.lastRoute !== currentRoute) {
            var previous = this.lastRoute;
            this.recordRouteLeave();
            this.lastRoute = currentRoute;
            this.recordRouteEnter();
            var extraData = {
                previousRoute: previous,
                currentRoute: currentRoute,
                changeType: changeType,
                enterTime: this.routeEnterTime
            };
            this.monitor.reportInfo('INFO', {
                pluginName: this.name,
                message: "Route Changed (".concat(changeType, "): ").concat(currentRoute),
                extraData: extraData,
                url: window.location.href,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
            monitorRouteChange.emit("monitorRouteChange", extraData);
        }
    };
    RoutePlugin.prototype.getCurrentRoute = function () {
        return window.location.href;
    };
    RoutePlugin.prototype.wrapHistoryMethods = function () {
        var self = this;
        this.originalPushState = history.pushState;
        this.originalReplaceState = history.replaceState;
        history.pushState = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = self.originalPushState.apply(this, args);
            self.handleRouteChange('pushState');
            return result;
        };
        history.replaceState = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = self.originalReplaceState.apply(this, args);
            self.handleRouteChange('replaceState');
            return result;
        };
    };
    RoutePlugin.prototype.wrapWindowOpen = function () {
        var self = this;
        try {
            this.originalWindowOpen = window.open;
            window.open = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                try {
                    var url = args[0];
                    var extraData = {
                        previousRoute: self.lastRoute,
                        currentRoute: url,
                        changeType: 'window.open',
                        enterTime: getTimestamp()
                    };
                    self.monitor.reportInfo('INFO', {
                        pluginName: self.name,
                        message: "window.open -> ".concat(url),
                        url: window.location.href,
                        extraData: extraData,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                    monitorRouteChange.emit('monitorRouteChange', extraData);
                }
                catch (e) {
                }
                return self.originalWindowOpen.apply(this, args);
            };
        }
        catch (e) {
        }
    };
    RoutePlugin.prototype.recordRouteEnter = function () {
        this.routeEnterTime = getTimestamp();
    };
    RoutePlugin.prototype.recordRouteLeave = function () {
        if (this.lastRoute && this.routeEnterTime) {
            var leaveTime = getTimestamp();
            var duration = leaveTime - this.routeEnterTime;
            var extraData = {
                route: this.lastRoute,
                enterTime: this.routeEnterTime,
                leaveTime: leaveTime,
                duration: duration
            };
            this.monitor.reportInfo('INFO', {
                pluginName: this.name,
                message: "Route Left: ".concat(this.lastRoute),
                extraData: extraData,
                url: window.location.href,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        }
    };
    return RoutePlugin;
}());

let e = -1;
const t = t => {
    addEventListener("pageshow", n => {
      n.persisted && (e = n.timeStamp, t(n));
    }, true);
  },
  n = (e, t, n, i) => {
    let s, o;
    return r => {
      t.value >= 0 && (r || i) && (o = t.value - (s ?? 0), (o || void 0 === s) && (s = t.value, t.delta = o, t.rating = ((e, t) => e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good")(t.value, n), e(t)));
    };
  },
  i = e => {
    requestAnimationFrame(() => requestAnimationFrame(() => e()));
  },
  s = () => {
    const e = performance.getEntriesByType("navigation")[0];
    if (e && e.responseStart > 0 && e.responseStart < performance.now()) return e;
  },
  o = () => {
    const e = s();
    return e?.activationStart ?? 0;
  },
  r = (t, n = -1) => {
    const i = s();
    let r = "navigate";
    e >= 0 ? r = "back-forward-cache" : i && (document.prerendering || o() > 0 ? r = "prerender" : document.wasDiscarded ? r = "restore" : i.type && (r = i.type.replace(/_/g, "-")));
    return {
      name: t,
      value: n,
      rating: "good",
      delta: 0,
      entries: [],
      id: `v5-${Date.now()}-${Math.floor(8999999999999 * Math.random()) + 1e12}`,
      navigationType: r
    };
  },
  c = new WeakMap();
function a(e, t) {
  return c.get(e) || c.set(e, new t()), c.get(e);
}
class d {
  t;
  i = 0;
  o = [];
  h(e) {
    if (e.hadRecentInput) return;
    const t = this.o[0],
      n = this.o.at(-1);
    this.i && t && n && e.startTime - n.startTime < 1e3 && e.startTime - t.startTime < 5e3 ? (this.i += e.value, this.o.push(e)) : (this.i = e.value, this.o = [e]), this.t?.(e);
  }
}
const h = (e, t, n = {}) => {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(e)) {
        const i = new PerformanceObserver(e => {
          Promise.resolve().then(() => {
            t(e.getEntries());
          });
        });
        return i.observe({
          type: e,
          buffered: !0,
          ...n
        }), i;
      }
    } catch {}
  },
  f = e => {
    let t = false;
    return () => {
      t || (e(), t = true);
    };
  };
let u = -1;
const l = new Set(),
  m = () => "hidden" !== document.visibilityState || document.prerendering ? 1 / 0 : 0,
  p = e => {
    if ("hidden" === document.visibilityState) {
      if ("visibilitychange" === e.type) for (const e of l) e();
      isFinite(u) || (u = "visibilitychange" === e.type ? e.timeStamp : 0, removeEventListener("prerenderingchange", p, true));
    }
  },
  v = () => {
    if (u < 0) {
      const e = o(),
        n = document.prerendering ? void 0 : globalThis.performance.getEntriesByType("visibility-state").filter(t => "hidden" === t.name && t.startTime > e)[0]?.startTime;
      u = n ?? m(), addEventListener("visibilitychange", p, true), addEventListener("prerenderingchange", p, true), t(() => {
        setTimeout(() => {
          u = m();
        });
      });
    }
    return {
      get firstHiddenTime() {
        return u;
      },
      onHidden(e) {
        l.add(e);
      }
    };
  },
  g = e => {
    document.prerendering ? addEventListener("prerenderingchange", () => e(), true) : e();
  },
  y = [1800, 3e3],
  E = (e, s = {}) => {
    g(() => {
      const c = v();
      let a,
        d = r("FCP");
      const f = h("paint", e => {
        for (const t of e) "first-contentful-paint" === t.name && (f.disconnect(), t.startTime < c.firstHiddenTime && (d.value = Math.max(t.startTime - o(), 0), d.entries.push(t), a(true)));
      });
      f && (a = n(e, d, y, s.reportAllChanges), t(t => {
        d = r("FCP"), a = n(e, d, y, s.reportAllChanges), i(() => {
          d.value = performance.now() - t.timeStamp, a(true);
        });
      }));
    });
  },
  b = [.1, .25],
  L = (e, s = {}) => {
    const o = v();
    E(f(() => {
      let c,
        f = r("CLS", 0);
      const u = a(s, d),
        l = e => {
          for (const t of e) u.h(t);
          u.i > f.value && (f.value = u.i, f.entries = u.o, c());
        },
        m = h("layout-shift", l);
      m && (c = n(e, f, b, s.reportAllChanges), o.onHidden(() => {
        l(m.takeRecords()), c(true);
      }), t(() => {
        u.i = 0, f = r("CLS", 0), c = n(e, f, b, s.reportAllChanges), i(() => c());
      }), setTimeout(c));
    }));
  };
let P = 0,
  T = 1 / 0,
  _ = 0;
const M = e => {
  for (const t of e) t.interactionId && (T = Math.min(T, t.interactionId), _ = Math.max(_, t.interactionId), P = _ ? (_ - T) / 7 + 1 : 0);
};
let w;
const C = () => w ? P : performance.interactionCount ?? 0,
  I = () => {
    "interactionCount" in performance || w || (w = h("event", M, {
      type: "event",
      buffered: true,
      durationThreshold: 0
    }));
  };
let F = 0;
class k {
  u = [];
  l = new Map();
  m;
  p;
  v() {
    F = C(), this.u.length = 0, this.l.clear();
  }
  L() {
    const e = Math.min(this.u.length - 1, Math.floor((C() - F) / 50));
    return this.u[e];
  }
  h(e) {
    if (this.m?.(e), !e.interactionId && "first-input" !== e.entryType) return;
    const t = this.u.at(-1);
    let n = this.l.get(e.interactionId);
    if (n || this.u.length < 10 || e.duration > t.P) {
      if (n ? e.duration > n.P ? (n.entries = [e], n.P = e.duration) : e.duration === n.P && e.startTime === n.entries[0].startTime && n.entries.push(e) : (n = {
        id: e.interactionId,
        entries: [e],
        P: e.duration
      }, this.l.set(n.id, n), this.u.push(n)), this.u.sort((e, t) => t.P - e.P), this.u.length > 10) {
        const e = this.u.splice(10);
        for (const t of e) this.l.delete(t.id);
      }
      this.p?.(n);
    }
  }
}
const A = e => {
    const t = globalThis.requestIdleCallback || setTimeout;
    "hidden" === document.visibilityState ? e() : (e = f(e), addEventListener("visibilitychange", e, {
      once: true,
      capture: true
    }), t(() => {
      e(), removeEventListener("visibilitychange", e, {
        capture: true
      });
    }));
  },
  B = [200, 500],
  S = (e, i = {}) => {
    if (!globalThis.PerformanceEventTiming || !("interactionId" in PerformanceEventTiming.prototype)) return;
    const s = v();
    g(() => {
      I();
      let o,
        c = r("INP");
      const d = a(i, k),
        f = e => {
          A(() => {
            for (const t of e) d.h(t);
            const t = d.L();
            t && t.P !== c.value && (c.value = t.P, c.entries = t.entries, o());
          });
        },
        u = h("event", f, {
          durationThreshold: i.durationThreshold ?? 40
        });
      o = n(e, c, B, i.reportAllChanges), u && (u.observe({
        type: "first-input",
        buffered: true
      }), s.onHidden(() => {
        f(u.takeRecords()), o(true);
      }), t(() => {
        d.v(), c = r("INP"), o = n(e, c, B, i.reportAllChanges);
      }));
    });
  };
class N {
  m;
  h(e) {
    this.m?.(e);
  }
}
const q = [2500, 4e3],
  x = (e, s = {}) => {
    g(() => {
      const c = v();
      let d,
        u = r("LCP");
      const l = a(s, N),
        m = e => {
          s.reportAllChanges || (e = e.slice(-1));
          for (const t of e) l.h(t), t.startTime < c.firstHiddenTime && (u.value = Math.max(t.startTime - o(), 0), u.entries = [t], d());
        },
        p = h("largest-contentful-paint", m);
      if (p) {
        d = n(e, u, q, s.reportAllChanges);
        const o = f(() => {
            m(p.takeRecords()), p.disconnect(), d(true);
          }),
          c = e => {
            e.isTrusted && (A(o), removeEventListener(e.type, c, {
              capture: true
            }));
          };
        for (const e of ["keydown", "click", "visibilitychange"]) addEventListener(e, c, {
          capture: true
        });
        t(t => {
          u = r("LCP"), d = n(e, u, q, s.reportAllChanges), i(() => {
            u.value = performance.now() - t.timeStamp, d(true);
          });
        });
      }
    });
  },
  H = [800, 1800],
  O = e => {
    document.prerendering ? g(() => O(e)) : "complete" !== document.readyState ? addEventListener("load", () => O(e), true) : setTimeout(e);
  },
  $ = (e, i = {}) => {
    let c = r("TTFB"),
      a = n(e, c, H, i.reportAllChanges);
    O(() => {
      const d = s();
      d && (c.value = Math.max(d.responseStart - o(), 0), c.entries = [d], a(true), t(() => {
        c = r("TTFB", 0), a = n(e, c, H, i.reportAllChanges), a(true);
      }));
    });
  };

var PerformancePlugin = (function () {
    function PerformancePlugin(config) {
        if (config === void 0) { config = {}; }
        this.name = 'performance';
        this.monitor = null;
        this.resourceObserver = null;
        this.navigationObserver = null;
        this.paintObserver = null;
        this.longTaskObserver = null;
        this.fpsIntervalId = null;
        this.memoryIntervalId = null;
        this.abortController = null;
        this.boundHandleRouteChange = function () { };
        this.config = __assign$1({ longTaskEnabled: true, memoryEnabled: true, fpsEnabled: true, resourceEnabled: true, navigationEnabled: true, webVitalsEnabled: true }, config);
    }
    PerformancePlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.abortController = new AbortController();
        if (typeof PerformanceObserver === 'undefined' || typeof performance === 'undefined') {
            console.warn('Performance API is not supported in this browser');
            return;
        }
        this.run();
        this.boundHandleRouteChange = this.handleRouteChange.bind(this);
        monitorRouteChange.on("monitorRouteChange", this.boundHandleRouteChange);
    };
    PerformancePlugin.prototype.run = function () {
        if (this.config.resourceEnabled) {
            this.setupResourceMonitoring();
        }
        if (this.config.navigationEnabled) {
            this.setupNavigationMonitoring();
        }
        if (this.config.webVitalsEnabled) {
            this.setupWebVitals();
        }
        if (this.config.longTaskEnabled) {
            this.setupLongTaskMonitoring();
        }
        if (this.config.memoryEnabled) {
            this.setupMemoryMonitoring();
        }
        if (this.config.fpsEnabled) {
            this.setupFPSMonitoring();
        }
    };
    PerformancePlugin.prototype.clearEffects = function () {
        if (this.resourceObserver) {
            this.resourceObserver.disconnect();
            this.resourceObserver = null;
        }
        if (this.navigationObserver) {
            this.navigationObserver.disconnect();
            this.navigationObserver = null;
        }
        if (this.paintObserver) {
            this.paintObserver.disconnect();
            this.paintObserver = null;
        }
        if (this.longTaskObserver) {
            this.longTaskObserver.disconnect();
            this.longTaskObserver = null;
        }
        if (this.fpsIntervalId) {
            clearInterval(this.fpsIntervalId);
            this.fpsIntervalId = null;
        }
        if (this.memoryIntervalId) {
            clearInterval(this.memoryIntervalId);
            this.memoryIntervalId = null;
        }
    };
    PerformancePlugin.prototype.setupLongTaskMonitoring = function () {
        var _this = this;
        try {
            if (typeof PerformanceObserver === 'undefined' || typeof window.PerformanceLongTaskTiming === 'undefined') {
                return;
            }
            this.longTaskObserver = new PerformanceObserver(function (list) {
                list.getEntries().forEach(function (entry) {
                    var _a;
                    if (entry.entryType === 'longtask') {
                        var extraData = {
                            type: 'longtask',
                            name: entry.name,
                            startTime: entry.startTime,
                            duration: entry.duration,
                            attribution: entry.attribution || []
                        };
                        (_a = _this.monitor) === null || _a === void 0 ? void 0 : _a.reportInfo('INFO', {
                            pluginName: _this.name,
                            message: 'Long Task Detected',
                            url: window.location.href,
                            extraData: extraData,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                });
            });
            this.longTaskObserver.observe({ entryTypes: ['longtask'] });
        }
        catch (e) {
            console.error('Error setting up long task monitoring:', e);
        }
    };
    PerformancePlugin.prototype.setupMemoryMonitoring = function () {
        var _this = this;
        var memorySupported = 'memory' in performance ||
            !!performance.mozMemory ||
            !!window.console.memory;
        if (!memorySupported) {
            this.estimateMemoryUsage();
            return;
        }
        var lastUsed = 0;
        var lastTotal = 0;
        var memoryData = {
            samples: [],
            peaks: [],
            trend: 'stable'
        };
        this.memoryIntervalId = window.setInterval(function () {
            var _a;
            try {
                var memory = performance.memory;
                if (memory) {
                    var usedDiff = Math.abs(memory.usedJSHeapSize - lastUsed);
                    var totalDiff = Math.abs(memory.totalJSHeapSize - lastTotal);
                    var percent = memory.totalJSHeapSize > 0 ? (memory.usedJSHeapSize / memory.totalJSHeapSize) : 0;
                    memoryData.samples.push({
                        used: memory.usedJSHeapSize,
                        total: memory.totalJSHeapSize,
                        timestamp: getTimestamp()
                    });
                    if (memoryData.peaks.length === 0 || memory.usedJSHeapSize > memoryData.peaks[memoryData.peaks.length - 1].used) {
                        memoryData.peaks.push({
                            used: memory.usedJSHeapSize,
                            timestamp: getTimestamp()
                        });
                    }
                    if (memoryData.samples.length > 30) {
                        memoryData.samples.shift();
                    }
                    if (memoryData.peaks.length > 10) {
                        memoryData.peaks.shift();
                    }
                    var trend = 'stable';
                    if (memoryData.samples.length > 5) {
                        var recentSamples = memoryData.samples.slice(-5);
                        var firstSample = recentSamples[0];
                        var lastSample = recentSamples[recentSamples.length - 1];
                        if (lastSample.used > firstSample.used * 1.1) {
                            trend = 'increasing';
                        }
                        else if (lastSample.used < firstSample.used * 0.9) {
                            trend = 'decreasing';
                        }
                    }
                    memoryData.trend = trend;
                    var isLeakDetected = trend === 'increasing' && memoryData.samples.length > 10 && _this.detectMemoryLeak(memoryData.samples);
                    if (usedDiff > 5 * 1024 * 1024 ||
                        totalDiff > 5 * 1024 * 1024 ||
                        percent > 0.9 ||
                        isLeakDetected) {
                        var extraData = {
                            type: 'memory',
                            usedJSHeapSize: memory.usedJSHeapSize,
                            totalJSHeapSize: memory.totalJSHeapSize,
                            jsHeapSizeLimit: memory.jsHeapSizeLimit,
                            trend: trend
                        };
                        (_a = _this.monitor) === null || _a === void 0 ? void 0 : _a.reportInfo('INFO', {
                            pluginName: _this.name,
                            message: isLeakDetected ? 'Memory Leak Detected' : 'Memory Usage',
                            url: window.location.href,
                            extraData: extraData,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                    lastUsed = memory.usedJSHeapSize;
                    lastTotal = memory.totalJSHeapSize;
                }
            }
            catch (e) {
                console.error('Error in memory monitoring:', e);
            }
        }, 5000);
    };
    PerformancePlugin.prototype.estimateMemoryUsage = function () {
        console.warn('Memory monitoring not supported in this browser');
    };
    PerformancePlugin.prototype.detectMemoryLeak = function (samples) {
        if (samples.length < 10) {
            return false;
        }
        var n = samples.length;
        var sumX = 0;
        var sumY = 0;
        var sumXY = 0;
        var sumXX = 0;
        samples.forEach(function (sample, i) {
            var x = i;
            var y = sample.used;
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        });
        var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope > 50000;
    };
    PerformancePlugin.prototype.setupFPSMonitoring = function () {
        var _this = this;
        var lastFrameTime = performance.now();
        var minFps = Infinity;
        var maxFps = 0;
        var fpsList = [];
        var lastReportTime = performance.now();
        var frameCount = 0;
        var lastUserInteraction = 0;
        var userInteracting = false;
        var userInteractionEvents = ['click', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        var handleUserInteraction = function () {
            lastUserInteraction = performance.now();
            userInteracting = true;
            setTimeout(function () {
                userInteracting = false;
            }, 1000);
        };
        userInteractionEvents.forEach(function (eventType) {
            var _a;
            document.addEventListener(eventType, handleUserInteraction, { passive: true, signal: (_a = _this.abortController) === null || _a === void 0 ? void 0 : _a.signal });
        });
        var detectFrameDrops = function () {
            var _a, _b;
            var now = performance.now();
            var frameTime = now - lastFrameTime;
            if (frameTime > 33) {
                var isDuringInteraction = userInteracting || (now - lastUserInteraction < 1000);
                var extraData = {
                    type: 'frame_drop',
                    frameTime: Math.round(frameTime * 100) / 100,
                    expectedFrameTime: 16.67,
                    timestamp: now,
                    isDuringInteraction: isDuringInteraction,
                    timeSinceLastInteraction: now - lastUserInteraction
                };
                (_a = _this.monitor) === null || _a === void 0 ? void 0 : _a.reportInfo('INFO', {
                    pluginName: _this.name,
                    message: 'Frame Drop Detected',
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            }
            frameCount++;
            if (now - lastReportTime >= 1000) {
                var fps = Math.round((frameCount * 1000) / (now - lastReportTime));
                fpsList.push(fps);
                minFps = Math.min(minFps, fps);
                maxFps = Math.max(maxFps, fps);
                var avgFps = 0;
                if (fpsList.length > 0) {
                    avgFps = Math.round(fpsList.reduce(function (a, b) { return a + b; }, 0) / fpsList.length);
                }
                if (fps < 45 || (fpsList.length > 1 && Math.abs(fps - (fpsList[fpsList.length - 2] || 0)) > 10)) {
                    var extraData = {
                        type: 'fps',
                        fps: fps,
                        minFps: Math.round(minFps),
                        maxFps: Math.round(maxFps),
                        avgFps: avgFps,
                        frameCount: frameCount,
                        timestamp: now,
                        duration: now - lastReportTime
                    };
                    (_b = _this.monitor) === null || _b === void 0 ? void 0 : _b.reportInfo('INFO', {
                        pluginName: _this.name,
                        message: 'FPS Report',
                        url: window.location.href,
                        extraData: extraData,
                        timestamp: getTimestamp(),
                        date: formatTimestamp()
                    });
                }
                if (fpsList.length > 60) {
                    fpsList.shift();
                }
                frameCount = 0;
                lastReportTime = now;
            }
            lastFrameTime = now;
            _this.fpsIntervalId = window.requestAnimationFrame(detectFrameDrops);
        };
        this.fpsIntervalId = window.requestAnimationFrame(detectFrameDrops);
    };
    PerformancePlugin.prototype.destroy = function () {
        this.clearEffects();
        if (this.boundHandleRouteChange) {
            monitorRouteChange.off("monitorRouteChange", this.boundHandleRouteChange);
        }
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.monitor = null;
    };
    PerformancePlugin.prototype.handleRouteChange = function (data) {
        this.run();
    };
    PerformancePlugin.prototype.setupResourceMonitoring = function () {
        var _this = this;
        try {
            this.resourceObserver = new PerformanceObserver(function (list) {
                var allowedInitiatorTypes = new Set([
                    'script',
                    'link',
                    'img',
                    'css',
                    'video',
                    'audio',
                    'iframe',
                    'fetch',
                    'xmlhttprequest',
                    'worker',
                    'serviceworker',
                    'font',
                    'json',
                    'wasm',
                    'other'
                ]);
                var allowedExt = /\.(js|mjs|cjs|css|html?|json|wasm|map|manifest|jpg|jpeg|png|gif|svg|webp|ico|mp4|webm|ogg|mp3|m4a|wav|woff2?|woff|ttf|eot|otf)$/i;
                list.getEntries().forEach(function (entry) {
                    if (entry.entryType === 'resource') {
                        var resourceEntry = entry;
                        var initiatorType = resourceEntry.initiatorType || '';
                        var url = resourceEntry.name || '';
                        if (initiatorType === 'beacon') {
                            return;
                        }
                        var shouldInclude = allowedInitiatorTypes.has(initiatorType) || allowedExt.test(url);
                        if (!shouldInclude) {
                            return;
                        }
                        var transferSize = typeof resourceEntry.transferSize === 'number' ? resourceEntry.transferSize : -1;
                        var encodedBodySize = typeof resourceEntry.encodedBodySize === 'number' ? resourceEntry.encodedBodySize : 0;
                        var decodedBodySize = typeof resourceEntry.decodedBodySize === 'number' ? resourceEntry.decodedBodySize : 0;
                        var fromCache = transferSize === 0 && (encodedBodySize > 0 || decodedBodySize > 0);
                        var extraData = {
                            type: 'resource',
                            name: resourceEntry.name,
                            entryType: resourceEntry.entryType,
                            startTime: resourceEntry.startTime,
                            duration: resourceEntry.duration,
                            initiatorType: initiatorType,
                            nextHopProtocol: resourceEntry.nextHopProtocol,
                            workerStart: resourceEntry.workerStart,
                            redirectStart: resourceEntry.redirectStart,
                            redirectEnd: resourceEntry.redirectEnd,
                            fetchStart: resourceEntry.fetchStart,
                            domainLookupStart: resourceEntry.domainLookupStart,
                            domainLookupEnd: resourceEntry.domainLookupEnd,
                            connectStart: resourceEntry.connectStart,
                            connectEnd: resourceEntry.connectEnd,
                            secureConnectionStart: resourceEntry.secureConnectionStart,
                            requestStart: resourceEntry.requestStart,
                            responseStart: resourceEntry.responseStart,
                            responseEnd: resourceEntry.responseEnd,
                            transferSize: resourceEntry.transferSize,
                            encodedBodySize: resourceEntry.encodedBodySize,
                            decodedBodySize: resourceEntry.decodedBodySize,
                            serverTiming: resourceEntry.serverTiming || [],
                            cached: fromCache
                        };
                        _this.monitor.reportInfo('INFO', {
                            pluginName: _this.name,
                            message: "Resource loaded: ".concat(resourceEntry.name),
                            url: window.location.href,
                            extraData: extraData,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                });
            });
            this.resourceObserver.observe({ entryTypes: ['resource'] });
        }
        catch (error) {
            console.error('Error setting up resource monitoring:', error);
        }
    };
    PerformancePlugin.prototype.setupNavigationMonitoring = function () {
        var _this = this;
        try {
            this.navigationObserver = new PerformanceObserver(function (list) {
                list.getEntries().forEach(function (entry) {
                    if (entry.entryType === 'navigation') {
                        var navEntry = entry;
                        var extraData = {
                            name: navEntry.name,
                            entryType: navEntry.entryType,
                            startTime: navEntry.startTime,
                            duration: navEntry.duration,
                            activationStart: navEntry.activationStart,
                            unloadEventStart: navEntry.unloadEventStart,
                            unloadEventEnd: navEntry.unloadEventEnd,
                            redirectStart: navEntry.redirectStart,
                            redirectEnd: navEntry.redirectEnd,
                            fetchStart: navEntry.fetchStart,
                            domainLookupStart: navEntry.domainLookupStart,
                            domainLookupEnd: navEntry.domainLookupEnd,
                            connectStart: navEntry.connectStart,
                            connectEnd: navEntry.connectEnd,
                            secureConnectionStart: navEntry.secureConnectionStart,
                            requestStart: navEntry.requestStart,
                            responseStart: navEntry.responseStart,
                            responseEnd: navEntry.responseEnd,
                            domInteractive: navEntry.domInteractive,
                            domContentLoadedEventStart: navEntry.domContentLoadedEventStart,
                            domContentLoadedEventEnd: navEntry.domContentLoadedEventEnd,
                            domComplete: navEntry.domComplete,
                            loadEventStart: navEntry.loadEventStart,
                            loadEventEnd: navEntry.loadEventEnd,
                            type: navEntry.type,
                            redirectCount: navEntry.redirectCount
                        };
                        _this.monitor.reportInfo('INFO', {
                            pluginName: _this.name,
                            message: 'Page navigation performance',
                            url: window.location.href,
                            extraData: extraData,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                });
            });
            this.navigationObserver.observe({ entryTypes: ['navigation'] });
        }
        catch (error) {
            console.error('Error setting up navigation monitoring:', error);
        }
    };
    PerformancePlugin.prototype.setupWebVitals = function () {
        var _this = this;
        try {
            x(function (metric) {
                var extraData = __assign$1(__assign$1({ type: 'web_vitals', metric: 'LCP', value: metric.value }, (metric.attribution && { attribution: metric.attribution })), { navigationType: metric.navigationType, rating: _this.getRating(metric.value, 2500, 4000) });
                _this.monitor.reportInfo('INFO', {
                    pluginName: _this.name,
                    message: 'Largest Contentful Paint (LCP)',
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
            S(function (metric) {
                var extraData = __assign$1(__assign$1({ type: 'web_vitals', metric: 'INP', value: metric.value }, (metric.attribution && { attribution: metric.attribution })), { navigationType: metric.navigationType, rating: _this.getRating(metric.value, 200, 500) });
                _this.monitor.reportInfo('INFO', {
                    pluginName: _this.name,
                    message: 'Interaction to Next Paint (INP)',
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
            L(function (metric) {
                var extraData = {
                    type: 'web_vitals',
                    metric: 'CLS',
                    value: metric.value,
                    navigationType: metric.navigationType,
                    rating: _this.getRating(metric.value, 0.1, 0.25)
                };
                _this.monitor.reportInfo('INFO', {
                    pluginName: _this.name,
                    message: 'Cumulative Layout Shift (CLS)',
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
            E(function (metric) {
                var extraData = __assign$1(__assign$1({ type: 'web_vitals', metric: 'FCP', value: metric.value }, (metric.attribution && { attribution: metric.attribution })), { navigationType: metric.navigationType, rating: _this.getRating(metric.value, 1800, 3000) });
                _this.monitor.reportInfo('INFO', {
                    pluginName: _this.name,
                    message: 'First Contentful Paint (FCP)',
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
            $(function (metric) {
                var extraData = __assign$1(__assign$1({ type: 'web_vitals', metric: 'TTFB', value: metric.value }, (metric.attribution && { attribution: metric.attribution })), { navigationType: metric.navigationType, rating: _this.getRating(metric.value, 800, 1800) });
                _this.monitor.reportInfo('INFO', {
                    pluginName: _this.name,
                    message: 'Time to First Byte (TTFB)',
                    url: window.location.href,
                    extraData: extraData,
                    timestamp: getTimestamp(),
                    date: formatTimestamp()
                });
            });
        }
        catch (error) {
            console.error('Error setting up Web Vitals monitoring:', error);
        }
    };
    PerformancePlugin.prototype.getRating = function (value, goodThreshold, poorThreshold) {
        if (value <= goodThreshold) {
            return 'good';
        }
        else if (value <= poorThreshold) {
            return 'needsImprovement';
        }
        else {
            return 'poor';
        }
    };
    return PerformancePlugin;
}());

var WhiteScreenPlugin = (function () {
    function WhiteScreenPlugin(config) {
        if (config === void 0) { config = {}; }
        this.name = 'whiteScreen';
        this.monitor = null;
        this.timer = null;
        this.startTime = 0;
        this.endTime = 0;
        this.resolved = false;
        this.boundHandleRouteChange = function () { };
        this.config = __assign$1({ keySelectors: ['img'], checkInterval: 100, timeout: 8000 }, config);
    }
    WhiteScreenPlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.run();
        this.boundHandleRouteChange = this.handleRouteChange.bind(this);
        monitorRouteChange.on("monitorRouteChange", this.boundHandleRouteChange);
    };
    WhiteScreenPlugin.prototype.run = function () {
        if (!this.monitor) {
            return;
        }
        this.startTime = getTimestamp();
        this.resolved = false;
        this.startCheck();
    };
    WhiteScreenPlugin.prototype.clearEffects = function () {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.resolved = true;
    };
    WhiteScreenPlugin.prototype.destroy = function () {
        this.clearEffects();
        if (this.boundHandleRouteChange) {
            monitorRouteChange.off("monitorRouteChange", this.boundHandleRouteChange);
        }
        this.monitor = null;
    };
    WhiteScreenPlugin.prototype.handleRouteChange = function (data) {
        this.run();
    };
    WhiteScreenPlugin.prototype.startCheck = function () {
        var _this = this;
        var _a = this.config, checkInterval = _a.checkInterval, timeout = _a.timeout;
        if (!this.monitor) {
            return;
        }
        var start = getTimestamp();
        this.timer = window.setInterval(function () {
            if (_this.resolved || !_this.monitor) {
                return;
            }
            var visible = _this.checkKeyElements();
            if (visible) {
                _this.endTime = getTimestamp();
                _this.report('success');
                _this.clearEffects();
            }
            else if (getTimestamp() - start > (timeout || 8000)) {
                _this.endTime = getTimestamp();
                _this.report('timeout');
                _this.clearEffects();
            }
        }, checkInterval);
    };
    WhiteScreenPlugin.prototype.checkKeyElements = function () {
        var _this = this;
        var selectors = this.config.keySelectors || [];
        for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
            var sel = selectors_1[_i];
            var els = Array.from(document.querySelectorAll(sel));
            for (var _a = 0, els_1 = els; _a < els_1.length; _a++) {
                var el = els_1[_a];
                if (el instanceof HTMLImageElement) {
                    if (el.complete && el.naturalWidth > 0 && this.isElementVisible(el)) {
                        return true;
                    }
                }
                else if (el instanceof HTMLElement) {
                    var style = window.getComputedStyle(el);
                    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') === 0) {
                        continue;
                    }
                    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
                        var rect = el.getBoundingClientRect();
                        if (rect.bottom < 0 || rect.top > (window.innerHeight || document.documentElement.clientHeight) || rect.right < 0 || rect.left > (window.innerWidth || document.documentElement.clientWidth)) {
                            continue;
                        }
                        if (el.textContent && el.textContent.trim().length > 0) {
                            if (this.isElementVisible(el)) {
                                return true;
                            }
                        }
                        var imgs = Array.from(el.querySelectorAll('img'));
                        if (imgs.some(function (img) { return img.complete && img.naturalWidth > 0 && _this.isElementVisible(img); })) {
                            return true;
                        }
                        var bgColor = style.backgroundColor;
                        var color = style.color;
                        if ((bgColor && !this.isColorTransparent(bgColor)) || (color && !this.isColorTransparent(color))) {
                            if (this.isElementVisible(el)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    };
    WhiteScreenPlugin.prototype.isColorTransparent = function (color) {
        if (!color) {
            return true;
        }
        if (color === 'transparent') {
            return true;
        }
        var rgbaMatch = color.match(/rgba?\(([^)]+)\)/);
        if (!rgbaMatch) {
            return false;
        }
        var parts = rgbaMatch[1].split(',').map(function (p) { return p.trim(); });
        if (parts.length === 4) {
            var alpha = parseFloat(parts[3]);
            return alpha === 0;
        }
        return false;
    };
    WhiteScreenPlugin.prototype.isElementVisible = function (el) {
        try {
            var rect = el.getBoundingClientRect();
            var x = rect.left + rect.width / 2;
            var y = rect.top + rect.height / 2;
            if (x < 0 || y < 0 || x > (window.innerWidth || document.documentElement.clientWidth) || y > (window.innerHeight || document.documentElement.clientHeight)) {
                return false;
            }
            var topEl = document.elementFromPoint(x, y);
            if (!topEl) {
                return false;
            }
            return el === topEl || el.contains(topEl) || topEl.contains(el);
        }
        catch (e) {
            return false;
        }
    };
    WhiteScreenPlugin.prototype.report = function (status) {
        if (!this.monitor) {
            return;
        }
        var extraData = {
            status: status,
            page: window.location.href,
            startTime: this.startTime,
            endTime: this.endTime,
            duration: this.endTime - this.startTime,
            selectors: this.config.keySelectors
        };
        this.monitor.reportInfo('INFO', {
            pluginName: this.name,
            message: "WhiteScreen check ".concat(status),
            url: window.location.href,
            extraData: extraData,
            timestamp: getTimestamp(),
            date: formatTimestamp()
        });
    };
    return WhiteScreenPlugin;
}());

var ConsolePlugin = (function () {
    function ConsolePlugin(config) {
        if (config === void 0) { config = {}; }
        this.name = 'console';
        this.monitor = null;
        this.originalError = null;
        this.originalWarn = null;
        this.name = 'console';
        this.config = __assign$1({ error: true, warn: true }, config);
    }
    ConsolePlugin.prototype.init = function (monitor) {
        this.monitor = monitor;
        this.setupConsoleCapture();
    };
    ConsolePlugin.prototype.setupConsoleCapture = function () {
        var self = this;
        try {
            if (this.config.error === false && this.config.warn === false) {
                return;
            }
            if (this.originalError || this.originalWarn) {
                return;
            }
            if (this.config.error === true) {
                this.originalError = console.error;
                console.error = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    try {
                        var message = args.map(function (a) {
                            if (typeof a === 'string') {
                                return a;
                            }
                            try {
                                return JSON.stringify(a);
                            }
                            catch (_a) {
                                return String(a);
                            }
                        }).join(' ');
                        var stack = (new Error()).stack;
                        var extraData = { args: args, stack: stack };
                        self.monitor && self.monitor.reportInfo('ERROR', {
                            pluginName: self.name,
                            message: message || 'console.error',
                            url: window.location.href,
                            extraData: extraData,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                    catch (e) {
                    }
                    return self.originalError && self.originalError.apply(console, args);
                };
            }
            if (this.config.warn === true) {
                this.originalWarn = console.warn;
                console.warn = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    try {
                        var message = args.map(function (a) {
                            if (typeof a === 'string') {
                                return a;
                            }
                            try {
                                return JSON.stringify(a);
                            }
                            catch (_a) {
                                return String(a);
                            }
                        }).join(' ');
                        var stack = (new Error()).stack;
                        var extraData = { args: args, stack: stack };
                        self.monitor && self.monitor.reportInfo('WARN', {
                            pluginName: self.name,
                            message: message || 'console.warn',
                            url: window.location.href,
                            extraData: extraData,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                    catch (e) {
                    }
                    return self.originalWarn && self.originalWarn.apply(console, args);
                };
            }
        }
        catch (e) {
        }
    };
    ConsolePlugin.prototype.destroy = function () {
        try {
            if (this.originalError) {
                console.error = this.originalError;
                this.originalError = null;
            }
            if (this.originalWarn) {
                console.warn = this.originalWarn;
                this.originalWarn = null;
            }
        }
        catch (e) {
        }
        this.monitor = null;
    };
    return ConsolePlugin;
}());

var DAILY_KEY_PREFIX = '__whayl_analytics_';
function safeJSONParse(s, fallback) {
    if (!s) {
        return fallback;
    }
    try {
        return JSON.parse(s);
    }
    catch (_a) {
        return fallback;
    }
}
var AnalyticsPlugin = (function () {
    function AnalyticsPlugin(config) {
        if (config === void 0) { config = {}; }
        this.name = 'analytics';
        this.monitor = null;
        this.abortController = null;
        this.ipCached = null;
        this.config = config;
    }
    AnalyticsPlugin.prototype.init = function (monitor) {
        var _this = this;
        this.monitor = monitor;
        try {
            this.clearOldRecords();
        }
        catch (e) {
        }
        this.abortController = new AbortController();
        var signal = this.abortController.signal;
        this.increasePV();
        this.ensureUV();
        this.ensureVV();
        this.ensureIP();
        var onUnload = function () {
            _this.reportNow();
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('pagehide', onUnload, { signal: signal });
            window.addEventListener('beforeunload', onUnload, { signal: signal });
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'hidden') {
                    _this.reportNow();
                }
            }, { signal: signal });
        }
    };
    AnalyticsPlugin.prototype.getTodayDate = function () {
        return formatTimestamp('YYYY/MM/DD', getTimestamp());
    };
    AnalyticsPlugin.prototype.getTodayKey = function (suffix) {
        var date = this.getTodayDate();
        return "".concat(DAILY_KEY_PREFIX).concat(date, "_").concat(suffix);
    };
    AnalyticsPlugin.prototype.clearOldRecords = function () {
        try {
            var todayPrefix = "".concat(DAILY_KEY_PREFIX).concat(this.getTodayDate(), "_");
            var keysToRemove = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (!key) {
                    continue;
                }
                if (key.startsWith(DAILY_KEY_PREFIX) && !key.startsWith(todayPrefix)) {
                    keysToRemove.push(key);
                }
            }
            if (keysToRemove.length > 0) {
                var oldRecords_1 = {};
                keysToRemove.forEach(function (k) {
                    try {
                        var raw = localStorage.getItem(k);
                        oldRecords_1[k] = safeJSONParse(raw, raw);
                    }
                    catch (e) {
                        oldRecords_1[k] = null;
                    }
                });
                try {
                    if (this.monitor) {
                        this.monitor.reportInfo('INFO', {
                            pluginName: this.name,
                            message: 'analytics_history_before_cleanup',
                            extraData: {
                                timestamp: getTimestamp(),
                                items: oldRecords_1,
                            },
                            url: window.location.href,
                            timestamp: getTimestamp(),
                            date: formatTimestamp()
                        });
                    }
                }
                catch (e) {
                }
                keysToRemove.forEach(function (k) { return localStorage.removeItem(k); });
            }
        }
        catch (e) {
        }
    };
    AnalyticsPlugin.prototype.increasePV = function () {
        try {
            var key = this.getTodayKey('pv');
            var cur = safeJSONParse(localStorage.getItem(key), 0);
            localStorage.setItem(key, JSON.stringify(cur + 1));
        }
        catch (e) {
        }
    };
    AnalyticsPlugin.prototype.ensureUV = function () {
        try {
            var key = this.getTodayKey('uv');
            var fp = this.monitor ? this.monitor.getFingerprint() : '';
            var uvSet = safeJSONParse(localStorage.getItem(key), {});
            var id = fp || this.getClientId();
            if (!uvSet[id]) {
                uvSet[id] = getTimestamp();
                localStorage.setItem(key, JSON.stringify(uvSet));
            }
        }
        catch (e) {
        }
    };
    AnalyticsPlugin.prototype.ensureVV = function () {
        try {
            var sessionFlag = this.getTodayKey('vv_session');
            var has = sessionStorage.getItem(sessionFlag);
            if (!has) {
                var key = this.getTodayKey('vv');
                var cur = safeJSONParse(localStorage.getItem(key), 0);
                localStorage.setItem(key, JSON.stringify(cur + 1));
                sessionStorage.setItem(sessionFlag, String(getTimestamp()));
            }
        }
        catch (e) {
        }
    };
    AnalyticsPlugin.prototype.ensureIP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key, cached, ip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!this.config.ipProvider) {
                            return [2];
                        }
                        key = this.getTodayKey('ip_list');
                        cached = safeJSONParse(localStorage.getItem(key), null);
                        if (cached) {
                            this.ipCached = cached;
                            return [2];
                        }
                        return [4, this.config.ipProvider()];
                    case 1:
                        ip = _a.sent();
                        if (ip) {
                            this.ipCached = ip;
                            localStorage.setItem(key, JSON.stringify(ip));
                        }
                        return [3, 3];
                    case 2:
                        _a.sent();
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    AnalyticsPlugin.prototype.getClientId = function () {
        try {
            var key = '__whayl_client_id__';
            var id = localStorage.getItem(key);
            if (!id) {
                id = "".concat(getTimestamp(), "_").concat(Math.random().toString(36).slice(2, 9));
                localStorage.setItem(key, id);
            }
            return id;
        }
        catch (e) {
            return 'unknown_client';
        }
    };
    AnalyticsPlugin.prototype.reportNow = function () {
        try {
            if (!this.monitor) {
                return;
            }
            var pvKey = this.getTodayKey('pv');
            var uvKey = this.getTodayKey('uv');
            var vvKey = this.getTodayKey('vv');
            var ipKey = this.getTodayKey('ip_list');
            var pv = safeJSONParse(localStorage.getItem(pvKey), 0);
            var uvObj = safeJSONParse(localStorage.getItem(uvKey), {});
            var vv = safeJSONParse(localStorage.getItem(vvKey), 0);
            var ip = safeJSONParse(localStorage.getItem(ipKey), null);
            var uv = Object.keys(uvObj).length;
            var payload = {
                pv: pv,
                uv: uv,
                vv: vv,
                ip: ip || this.ipCached || null,
                timestamp: getTimestamp(),
            };
            this.monitor.reportInfo('INFO', {
                pluginName: this.name,
                message: 'analytics_report',
                url: window.location.href,
                extraData: payload,
                timestamp: getTimestamp(),
                date: formatTimestamp()
            });
        }
        catch (e) {
        }
    };
    AnalyticsPlugin.prototype.destroy = function () {
        this.monitor = null;
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    };
    return AnalyticsPlugin;
}());

var BrowserMonitor = (function () {
    function BrowserMonitor(config) {
        var _this = this;
        this.plugins = [];
        this.monitor = new FrontendMonitor();
        this.abortController = null;
        this.isOnline = navigator.onLine;
        this.cacheLog = [];
        var _a = config.pluginsUse || {}, _b = _a.xhrPluginEnabled, xhrPluginEnabled = _b === void 0 ? true : _b, _c = _a.fetchPluginEnabled, fetchPluginEnabled = _c === void 0 ? true : _c, _d = _a.domPluginEnabled, domPluginEnabled = _d === void 0 ? true : _d, _e = _a.routePluginEnabled, routePluginEnabled = _e === void 0 ? true : _e, _f = _a.performancePluginEnabled, performancePluginEnabled = _f === void 0 ? true : _f, _g = _a.whiteScreenPluginEnabled, whiteScreenPluginEnabled = _g === void 0 ? true : _g, _h = _a.consolePluginEnabled, consolePluginEnabled = _h === void 0 ? true : _h, _j = _a.analyticsPluginEnabled, analyticsPluginEnabled = _j === void 0 ? true : _j;
        this.monitor.init(config === null || config === void 0 ? void 0 : config.monitorConfig);
        var pluginsToRegister = [
            xhrPluginEnabled && { name: 'XhrPlugin', creator: function () { return new XhrPlugin(); } },
            fetchPluginEnabled && { name: 'FetchPlugin', creator: function () { return new FetchPlugin(); } },
            domPluginEnabled && { name: 'DomPlugin', creator: function () { return new DomPlugin((config === null || config === void 0 ? void 0 : config.domPluginConfig) || {}); } },
            routePluginEnabled && { name: 'RoutePlugin', creator: function () { return new RoutePlugin(); } },
            performancePluginEnabled && { name: 'PerformancePlugin', creator: function () { return new PerformancePlugin((config === null || config === void 0 ? void 0 : config.performancePluginConfig) || {}); } },
            whiteScreenPluginEnabled && { name: 'WhiteScreenPlugin', creator: function () { return new WhiteScreenPlugin((config === null || config === void 0 ? void 0 : config.whiteScreenPluginConfig) || {}); } },
            consolePluginEnabled && { name: 'ConsolePlugin', creator: function () { return new ConsolePlugin((config === null || config === void 0 ? void 0 : config.consolePluginConfig) || {}); } },
            analyticsPluginEnabled && { name: 'AnalyticsPlugin', creator: function () { return new AnalyticsPlugin((config === null || config === void 0 ? void 0 : config.analyticsPluginConfig) || {}); } }
        ].filter(Boolean);
        pluginsToRegister.forEach(function (plugin) {
            _this.use(plugin.creator());
        });
        this.init();
        this.setupNetworkListener();
    }
    BrowserMonitor.prototype.init = function () {
        var _this = this;
        this.abortController = new AbortController();
        if (typeof document !== 'undefined' && 'hidden' in document) {
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'hidden') {
                    _this.reportAllLog();
                }
            }, {
                signal: this.abortController.signal
            });
        }
        else if (typeof window !== 'undefined' && 'pagehide' in window) {
            window.addEventListener('pagehide', function () {
                _this.reportAllLog();
            }, {
                signal: this.abortController.signal
            });
        }
        window.addEventListener('beforeunload', function () {
            _this.reportAllLog();
        }, {
            signal: this.abortController.signal
        });
    };
    BrowserMonitor.prototype.reportAllLog = function () {
        this.reportCacheLog();
        this.monitor.reportRestInfo();
    };
    BrowserMonitor.prototype.reportCacheLog = function () {
        var _this = this;
        if (this.cacheLog.length) {
            this.cacheLog.forEach(function (item) {
                _this.monitor.reportInfo(item.type, item.data);
            });
            this.cacheLog = [];
        }
    };
    BrowserMonitor.prototype.setupNetworkListener = function () {
        var _this = this;
        var _a, _b;
        window.addEventListener('online', function () {
            _this.isOnline = true;
            _this.cacheLog.push({
                type: 'OFF',
                data: {
                    pluginName: 'monitor-browser',
                    url: window.location.href,
                    extraData: {},
                    timestamp: getTimestamp(),
                    date: formatTimestamp(),
                    message: '设备恢复在线',
                    deviceInfo: _this.getDeviceInfoData(),
                    navigator: _this.getNavigatorData()
                }
            });
            _this.reportCacheLog();
        }, { signal: (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.signal });
        window.addEventListener('offline', function () {
            _this.isOnline = false;
            _this.cacheLog.push({
                type: 'OFF',
                data: {
                    pluginName: 'monitor-browser',
                    url: window.location.href,
                    extraData: {},
                    timestamp: getTimestamp(),
                    date: formatTimestamp(),
                    message: '设备离线',
                    deviceInfo: _this.getDeviceInfoData(),
                    navigator: _this.getNavigatorData()
                }
            });
        }, {
            signal: (_b = this.abortController) === null || _b === void 0 ? void 0 : _b.signal
        });
    };
    BrowserMonitor.prototype.setFingerprint = function (value) {
        this.monitor.setFingerprint(value);
    };
    BrowserMonitor.prototype.getFingerprint = function () {
        return this.monitor.getFingerprint();
    };
    BrowserMonitor.prototype.getNavigatorData = function () {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            onLine: navigator.onLine,
            cookieEnabled: navigator.cookieEnabled,
        };
    };
    BrowserMonitor.prototype.getDeviceInfoData = function () {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
        };
    };
    BrowserMonitor.prototype.reportInfo = function (type, data) {
        data.navigator = this.getNavigatorData();
        if (!this.isOnline) {
            this.cacheLog.push({ type: type, data: __assign$1(__assign$1({}, data), { deviceInfo: this.getDeviceInfoData(), navigator: this.getNavigatorData() }) });
            return;
        }
        this.monitor.reportInfo(type, __assign$1(__assign$1({}, data), { deviceInfo: this.getDeviceInfoData() }));
    };
    BrowserMonitor.prototype.use = function (plugin) {
        if (!plugin.name) {
            console.error('Plugin must have a name property');
            return;
        }
        if (typeof plugin.init !== 'function') {
            console.error("Plugin ".concat(plugin.name, " must have an init method"));
            return;
        }
        var existingPlugin = this.plugins.find(function (p) { return p.name === plugin.name; });
        if (existingPlugin) {
            console.warn("Plugin ".concat(plugin.name, " already exists, skipping addition."));
            return;
        }
        this.plugins.push(plugin);
        plugin.init({ reportInfo: this.reportInfo.bind(this), getFingerprint: this.getFingerprint.bind(this) });
    };
    BrowserMonitor.prototype.destroy = function () {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this.plugins.forEach(function (plugin) {
            if (typeof plugin.destroy === 'function') {
                plugin.destroy();
            }
        });
        this.plugins = [];
    };
    return BrowserMonitor;
}());

export { BrowserMonitor as default };
