(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.aiyMonitorCore = {}));
})(this, (function (exports) { 'use strict';

    var MYSTORAGE_COUNT = 100;
    var IMMEDIATE_REPORT_LEVEL = "ERROR";

    exports.ReportLevelEnum = void 0;
    (function (ReportLevelEnum) {
        ReportLevelEnum[ReportLevelEnum["ERROR"] = 0] = "ERROR";
        ReportLevelEnum[ReportLevelEnum["WARN"] = 1] = "WARN";
        ReportLevelEnum[ReportLevelEnum["INFO"] = 2] = "INFO";
        ReportLevelEnum[ReportLevelEnum["DEBUG"] = 3] = "DEBUG";
        ReportLevelEnum[ReportLevelEnum["OFF"] = 4] = "OFF";
    })(exports.ReportLevelEnum || (exports.ReportLevelEnum = {}));

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

    var FrontendMonitor = (function () {
        function FrontendMonitor() {
            this.config = {
                reportLevel: IMMEDIATE_REPORT_LEVEL,
                enabled: true,
                maxStorageCount: MYSTORAGE_COUNT
            };
            this.storageQueue = [];
            this.plugins = [];
            this.fingerprint = '';
        }
        FrontendMonitor.prototype.init = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.config = Object.assign(this.config, config);
                    return [2];
                });
            });
        };
        FrontendMonitor.prototype.getFingerprint = function () {
            return this.fingerprint;
        };
        FrontendMonitor.prototype.use = function (plugin) {
            var existingPlugin = this.plugins.find(function (p) { return p.name === plugin.name; });
            if (existingPlugin) {
                console.warn("Plugin ".concat(plugin.name, " already exists, skipping addition."));
                return;
            }
            this.plugins.push(plugin);
            plugin.init(this);
        };
        FrontendMonitor.prototype.log = function (pluginName, level, message, error, data) {
            if (!this.config.enabled) {
                return;
            }
            var timestamp = typeof performance !== 'undefined'
                ? Math.floor(performance.now() + performance.timeOrigin)
                : Date.now();
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
            if (exports.ReportLevelEnum[level] <= exports.ReportLevelEnum[this.config.reportLevel]) {
                this.report(errorInfo);
            }
            else {
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
            var reportableItems = this.storageQueue.filter(function (item) { return exports.ReportLevelEnum[item.level] <= exports.ReportLevelEnum[_this.config.reportLevel]; });
            if (reportableItems.length > 0) {
                reportableItems.forEach(function (item) { return _this.report(item); });
                this.storageQueue = this.storageQueue.filter(function (item) { return exports.ReportLevelEnum[item.level] > exports.ReportLevelEnum[_this.config.reportLevel]; });
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
            this.plugins.forEach(function (plugin) {
                if (plugin.destroy) {
                    plugin.destroy();
                }
            });
            this.plugins = [];
            this.storageQueue = [];
        };
        return FrontendMonitor;
    }());
    var monitor = new FrontendMonitor();

    exports.FrontendMonitor = FrontendMonitor;
    exports.IMMEDIATE_REPORT_LEVEL = IMMEDIATE_REPORT_LEVEL;
    exports.MYSTORAGE_COUNT = MYSTORAGE_COUNT;
    exports.monitor = monitor;

}));
