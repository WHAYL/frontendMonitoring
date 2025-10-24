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

var FrontendMonitor = (function () {
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
        var errorInfo = __assign(__assign({}, info), { fingerprint: this.fingerprint, oldFingerprint: this.oldFingerprint, platform: this.config.platform });
        if (ReportLevelEnum[info.level] <= ReportLevelEnum[this.config.reportLevel]) {
            this.report(errorInfo);
        }
        else {
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
        this.log(__assign(__assign({}, info), { level: level }));
    };
    FrontendMonitor.prototype.checkAndReportStored = function () {
        var _this = this;
        var reportableItems = this.storageQueue.filter(function (item) { return ReportLevelEnum[item.level] <= ReportLevelEnum[_this.config.reportLevel]; });
        if (reportableItems.length > 0) {
            reportableItems.forEach(function (item) { return _this.report(item); });
            this.storageQueue = this.storageQueue.filter(function (item) { return ReportLevelEnum[item.level] > ReportLevelEnum[_this.config.reportLevel]; });
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
            }
            catch (err) {
                console.error('[Frontend Monitor] Failed to send error report with custom handler:', err);
            }
        }
        else {
            console.log("[Frontend Monitor] : ".concat(JSON.stringify(errorInfo)));
        }
    };
    FrontendMonitor.prototype.destroy = function () {
        this.clearStorageQueue();
    };
    return FrontendMonitor;
}());

export { FrontendMonitor, IMMEDIATE_REPORT_LEVEL, MYSTORAGE_COUNT, ReportLevelEnum };
