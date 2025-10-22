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
            return typeof performance !== 'undefined'
                ? Math.floor(performance.now() + performance.timeOrigin)
                : Date.now();
        };
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
            var timestamp = this.getTimestamp();
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
