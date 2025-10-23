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

var FrontendMonitor = (function () {
    function FrontendMonitor() {
        this.config = {
            reportLevel: IMMEDIATE_REPORT_LEVEL,
            enabled: true,
            maxStorageCount: MYSTORAGE_COUNT,
            uploadHandler: null
        };
        this.storageQueue = [];
        this.removedItems = [];
        this.fingerprint = '';
    }
    FrontendMonitor.prototype.getTimestamp = function () {
        return typeof performance !== 'undefined' && typeof performance.now === 'function' && typeof performance.timeOrigin === 'number'
            ? performance.now() + performance.timeOrigin
            : Date.now();
    };
    FrontendMonitor.prototype.formatTimestamp = function (format, timestamp) {
        if (format === void 0) { format = 'YYYY/MM/DD hh:mm:ss.SSS'; }
        var ts = typeof timestamp === 'number' ? timestamp : this.getTimestamp();
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
    };
    FrontendMonitor.prototype.init = function (config) {
        this.config = Object.assign(this.config, config);
    };
    FrontendMonitor.prototype.getFingerprint = function () {
        return this.fingerprint;
    };
    FrontendMonitor.prototype.log = function (pluginName, level, message, extraData) {
        if (extraData === void 0) { extraData = {}; }
        if (!this.config.enabled) {
            return;
        }
        var errorInfo = {
            level: level,
            message: message,
            timestamp: this.getTimestamp(),
            date: this.formatTimestamp('YYYY/MM/DD hh:mm:ss.SSS'),
            url: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            pluginName: pluginName,
            fingerprint: this.fingerprint,
            devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
            extraData: extraData
        };
        if (ReportLevelEnum[level] <= ReportLevelEnum[this.config.reportLevel]) {
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
var monitor = new FrontendMonitor();

export { FrontendMonitor, IMMEDIATE_REPORT_LEVEL, MYSTORAGE_COUNT, ReportLevelEnum, monitor };
