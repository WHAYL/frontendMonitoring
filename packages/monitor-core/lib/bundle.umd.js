(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AiyMonitorCore = {}));
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

    var FrontendMonitor = (function () {
        function FrontendMonitor() {
            this.config = {
                reportLevel: IMMEDIATE_REPORT_LEVEL,
                enabled: true,
                maxStorageCount: MYSTORAGE_COUNT
            };
            this.storageQueue = [];
            this.fingerprint = '';
        }
        FrontendMonitor.prototype.getTimestamp = function () {
            return typeof performance !== 'undefined' && typeof performance.now === 'function' && typeof performance.timeOrigin === 'number'
                ? performance.now() + performance.timeOrigin
                : Date.now();
        };
        FrontendMonitor.prototype.init = function (config) {
            this.config = Object.assign(this.config, config);
        };
        FrontendMonitor.prototype.getFingerprint = function () {
            return this.fingerprint;
        };
        FrontendMonitor.prototype.log = function (pluginName, level, message, extraData) {
            if (extraData === void 0) { extraData = {}; }
            if (!this.config.enabled)
                return;
            var errorInfo = __assign({ level: level, message: message, timestamp: this.getTimestamp(), url: typeof window !== 'undefined' ? window.location.href : '', userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '', pluginName: pluginName, fingerprint: this.fingerprint }, extraData);
            if (exports.ReportLevelEnum[level] <= exports.ReportLevelEnum[this.config.reportLevel]) {
                this.report(errorInfo);
            }
            else {
                this.storageQueue.push(errorInfo);
                if (this.storageQueue.length > (this.config.maxStorageCount || MYSTORAGE_COUNT)) {
                    this.storageQueue.shift();
                }
            }
        };
        FrontendMonitor.prototype.error = function (pluginName, message, extraData) {
            if (extraData === void 0) { extraData = {}; }
            this.log(pluginName, 'ERROR', message, extraData);
        };
        FrontendMonitor.prototype.warn = function (pluginName, message, extraData) {
            if (extraData === void 0) { extraData = {}; }
            this.log(pluginName, 'WARN', message, extraData);
        };
        FrontendMonitor.prototype.info = function (pluginName, message, extraData) {
            if (extraData === void 0) { extraData = {}; }
            this.log(pluginName, 'INFO', message, extraData);
        };
        FrontendMonitor.prototype.debug = function (pluginName, message, extraData) {
            if (extraData === void 0) { extraData = {}; }
            this.log(pluginName, 'DEBUG', message, extraData);
        };
        FrontendMonitor.prototype.checkAndReportStored = function () {
            var _this = this;
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
