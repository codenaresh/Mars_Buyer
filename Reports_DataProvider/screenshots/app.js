var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13076,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00e40068-0045-0057-00aa-003200fa00e9.png",
        "timestamp": 1585044432774,
        "duration": 28251
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13076,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "000b0000-0078-006b-0053-0047001b00f8.png",
        "timestamp": 1585044464384,
        "duration": 5213
    },
    {
        "description": "should login to application thirsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13076,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00bb0091-00d4-00ed-0042-00ec00cb008b.png",
        "timestamp": 1585044469964,
        "duration": 4608
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5228,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044545666,
                "type": ""
            }
        ],
        "screenShotFile": "003d00d6-008b-0008-00db-008100a60005.png",
        "timestamp": 1585044514311,
        "duration": 31344
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5228,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044546199,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044556457,
                "type": ""
            }
        ],
        "screenShotFile": "0028000c-00be-004d-009f-000f008800e7.png",
        "timestamp": 1585044546066,
        "duration": 10386
    },
    {
        "description": "should login to application thirsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5228,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044556932,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044556932,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044566255,
                "type": ""
            }
        ],
        "screenShotFile": "00c9007e-0011-0015-0092-000900e9008d.png",
        "timestamp": 1585044556812,
        "duration": 9436
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 4428,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044867941,
                "type": ""
            }
        ],
        "screenShotFile": "005500a0-002d-002c-003e-0088001b00a8.png",
        "timestamp": 1585044825981,
        "duration": 41948
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 4428,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044868506,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044878869,
                "type": ""
            }
        ],
        "screenShotFile": "00fa005b-0003-002c-00ec-001300280088.png",
        "timestamp": 1585044868349,
        "duration": 10515
    },
    {
        "description": "should login to application thirsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 4428,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044889161,
                "type": ""
            }
        ],
        "screenShotFile": "00b600d1-004e-006e-006f-006300c500da.png",
        "timestamp": 1585044879218,
        "duration": 9935
    },
    {
        "description": "Report|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 4428,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: waiting for page to load for 10000ms\nWait timed out after 10000ms"
        ],
        "trace": [
            "TimeoutError: waiting for page to load for 10000ms\nWait timed out after 10000ms\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: waiting for page to load for 10000ms\n    at scheduleWait (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:685:32\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run it(\"Report\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:44:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044889693,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "security 2 Not allowed to load local resource: file:///C:/usersnareshseclipse-workspaceprotrractmars_byerreports_dataproviderscreenshots%0Deport.html",
                "timestamp": 1585044894180,
                "type": ""
            }
        ],
        "screenShotFile": "00a10013-00e2-0066-00a0-0097007900f0.png",
        "timestamp": 1585044889498,
        "duration": 14697
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7828,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044986805,
                "type": ""
            }
        ],
        "screenShotFile": "001e009a-00f8-0041-00d4-00fb00170003.png",
        "timestamp": 1585044957173,
        "duration": 29621
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7828,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585044997205,
                "type": ""
            }
        ],
        "screenShotFile": "006a00b3-00e0-00a0-0034-003700e4005e.png",
        "timestamp": 1585044987226,
        "duration": 9974
    },
    {
        "description": "should login to application thirsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7828,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045007546,
                "type": ""
            }
        ],
        "screenShotFile": "00e2004b-0041-00f6-0088-007e00010080.png",
        "timestamp": 1585044997703,
        "duration": 9839
    },
    {
        "description": "Report|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 7828,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: waiting for page to load for 10000ms\nWait timed out after 10005ms"
        ],
        "trace": [
            "TimeoutError: waiting for page to load for 10000ms\nWait timed out after 10005ms\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2201:17\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at runMicrotasks (<anonymous>)\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: waiting for page to load for 10000ms\n    at scheduleWait (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2188:20)\n    at ControlFlow.wait (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2517:12)\n    at Driver.wait (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:934:29)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:685:32\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run it(\"Report\") in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:44:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045008011,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "security 2 Not allowed to load local resource: file:///C:/usersnareshseclipse-workspaceprotrractmars_byerreports_dataproviderscreenshots%0Deport.html",
                "timestamp": 1585045017201,
                "type": ""
            }
        ],
        "screenShotFile": "004000ce-00b7-0076-0003-009500f8007f.png",
        "timestamp": 1585045007882,
        "duration": 19340
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 13296,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: status is not defined"
        ],
        "trace": [
            "ReferenceError: status is not defined\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:19:4\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045310833,
                "type": ""
            }
        ],
        "screenShotFile": "00d0001c-007f-0008-008d-00e3000a002f.png",
        "timestamp": 1585045266645,
        "duration": 44245
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 13296,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: status is not defined"
        ],
        "trace": [
            "ReferenceError: status is not defined\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:19:4\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045321293,
                "type": ""
            }
        ],
        "screenShotFile": "001700a4-00d4-0083-005f-00ff00bf0067.png",
        "timestamp": 1585045311286,
        "duration": 10061
    },
    {
        "description": "should login to application thirsset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 13296,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: status is not defined"
        ],
        "trace": [
            "ReferenceError: status is not defined\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:19:4\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045321877,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045331093,
                "type": ""
            }
        ],
        "screenShotFile": "0002007c-0039-0041-00ed-0029008600c1.png",
        "timestamp": 1585045321746,
        "duration": 9392
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 13296,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: status is not defined"
        ],
        "trace": [
            "ReferenceError: status is not defined\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:19:4\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [],
        "screenShotFile": "001d00a7-00c0-00bd-00b5-004000bd004f.png",
        "timestamp": 1585045331593,
        "duration": 4966
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 10808,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045412244,
                "type": ""
            }
        ],
        "screenShotFile": "007c00f8-007d-0000-00c4-00f200a800fe.png",
        "timestamp": 1585045384825,
        "duration": 27530
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 10808,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045422970,
                "type": ""
            }
        ],
        "screenShotFile": "00bf001d-00a3-0009-00aa-003100650086.png",
        "timestamp": 1585045412748,
        "duration": 10322
    },
    {
        "description": "should login to application thirsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 10808,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045437335,
                "type": ""
            }
        ],
        "screenShotFile": "001d002f-0097-00dc-00b3-007900ea002a.png",
        "timestamp": 1585045423426,
        "duration": 13996
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 10808,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585045437977,
                "type": ""
            }
        ],
        "screenShotFile": "006e0051-00cc-00f3-0082-000b00ef0033.png",
        "timestamp": 1585045437845,
        "duration": 4069
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 940,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046042418,
                "type": ""
            }
        ],
        "screenShotFile": "000b0043-0028-0014-00d2-0093007b0079.png",
        "timestamp": 1585045990673,
        "duration": 51850
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 940,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046053045,
                "type": ""
            }
        ],
        "screenShotFile": "00810090-00ff-000c-00d0-00ce00bd0068.png",
        "timestamp": 1585046042935,
        "duration": 10217
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 940,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046053691,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046062968,
                "type": ""
            }
        ],
        "screenShotFile": "00240012-005f-0044-00bb-00da00c3003e.png",
        "timestamp": 1585046053523,
        "duration": 9535
    },
    {
        "description": "should login to application fourthset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 940,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "NoSuchWindowError: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.findElements(By(xpath, //div[@id='toast-container']))\n    at Driver.schedule (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Driver.findElements (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:1048:19)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:159:44\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046063549,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046063549,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585046072752,
                "type": ""
            }
        ],
        "timestamp": 1585046063392,
        "duration": 77042
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 940,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)",
            "Failed: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "NoSuchWindowError: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: WebDriver.navigate().to(data:text/html,<html></html>)\n    at Driver.schedule (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at Navigation.to (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:1133:25)\n    at Driver.get (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:988:28)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:675:32\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run beforeEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:7:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)",
            "NoSuchWindowError: no such window: target window already closed\nfrom unknown error: web view not found\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Protractor.waitForAngular() - Locator: By(xpath, //div[@id='toast-container'])\n    at Driver.schedule (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [],
        "timestamp": 1585046140502,
        "duration": 21
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 12200,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Failed: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])"
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)",
            "NoSuchElementError: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:34:8\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at Timeout.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4283:11)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046188760,
                "type": ""
            }
        ],
        "screenShotFile": "001f004a-004f-009b-00bc-00a900c8006d.png",
        "timestamp": 1585046156961,
        "duration": 31791
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 12200,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046199274,
                "type": ""
            }
        ],
        "screenShotFile": "006b0057-0035-0039-008a-00ac00110080.png",
        "timestamp": 1585046189174,
        "duration": 10205
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 12200,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046209834,
                "type": ""
            }
        ],
        "screenShotFile": "00f50096-002b-0060-0020-00e8007a009a.png",
        "timestamp": 1585046199792,
        "duration": 10141
    },
    {
        "description": "should login to application fourthset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 12200,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL."
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)"
        ],
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585046222879,
                "type": ""
            }
        ],
        "screenShotFile": "008d0088-0040-00b6-0095-001000ed0077.png",
        "timestamp": 1585046210307,
        "duration": 33948
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 12200,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:34:8\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [],
        "screenShotFile": "003d0003-0070-0098-00b5-00eb005400ee.png",
        "timestamp": 1585046250698,
        "duration": 4943
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 11376,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL."
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046345577,
                "type": ""
            }
        ],
        "screenShotFile": "004f00f4-00c6-009c-0031-0017002c0031.png",
        "timestamp": 1585046293468,
        "duration": 52222
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11376,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046356090,
                "type": ""
            }
        ],
        "screenShotFile": "0072008d-00e9-001a-0047-00aa003e0076.png",
        "timestamp": 1585046346105,
        "duration": 10090
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11376,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046356736,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046366330,
                "type": ""
            }
        ],
        "screenShotFile": "00a8001c-0051-0014-0085-0046007300ab.png",
        "timestamp": 1585046356581,
        "duration": 9839
    },
    {
        "description": "should login to application fourthset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 11376,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Protractor.waitForAngular() - Locator: By(xpath, //div[@id='toast-container'])\n    at Driver.schedule (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046366920,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046366920,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585046376831,
                "type": ""
            }
        ],
        "screenShotFile": "003e0022-00b5-000c-00fb-001500e30003.png",
        "timestamp": 1585046366783,
        "duration": 20439
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 11376,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:34:8\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046387792,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046387792,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585046387793,
                "type": ""
            }
        ],
        "screenShotFile": "00eb0064-007c-00c2-003e-00bc008b009f.png",
        "timestamp": 1585046387644,
        "duration": 4542
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 3300,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL."
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046492813,
                "type": ""
            }
        ],
        "screenShotFile": "009c0014-00b6-00dd-00a5-005500620024.png",
        "timestamp": 1585046441592,
        "duration": 51334
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3300,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046503638,
                "type": ""
            }
        ],
        "screenShotFile": "0068009f-0042-0097-008f-009f003f0072.png",
        "timestamp": 1585046493341,
        "duration": 10397
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3300,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585046514118,
                "type": ""
            }
        ],
        "screenShotFile": "00cc00d1-00ae-0074-00df-00ed00b90004.png",
        "timestamp": 1585046504143,
        "duration": 10076
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 12928,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047747961,
                "type": ""
            }
        ],
        "screenShotFile": "00f500b8-009c-0016-0022-00640072002c.png",
        "timestamp": 1585047723531,
        "duration": 24527
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 12928,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047748974,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047759526,
                "type": ""
            }
        ],
        "screenShotFile": "00a900b1-0098-00b1-00af-0067004a0097.png",
        "timestamp": 1585047748785,
        "duration": 10825
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 12928,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047760111,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047760111,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047769687,
                "type": ""
            }
        ],
        "screenShotFile": "001d0058-003e-00fd-0088-00f700770038.png",
        "timestamp": 1585047759975,
        "duration": 9810
    },
    {
        "description": "should login to application fourthset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 12928,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL."
        ],
        "trace": [
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)",
            "Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.\n    at Timeout._onTimeout (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4281:23)\n    at listOnTimeout (internal/timers.js:531:17)\n    at processTimers (internal/timers.js:475:7)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047770332,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047770332,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585047770332,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585047779633,
                "type": ""
            }
        ],
        "screenShotFile": "00690050-00be-00af-00fa-00870031008d.png",
        "timestamp": 1585047770214,
        "duration": 249434
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 12928,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:34:8\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [],
        "screenShotFile": "009b00f3-002f-00d6-002e-001e007b00ba.png",
        "timestamp": 1585048030138,
        "duration": 4675
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11812,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048074062,
                "type": ""
            }
        ],
        "screenShotFile": "00be00b2-0041-0084-0092-007200420087.png",
        "timestamp": 1585048052365,
        "duration": 21803
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11812,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048084736,
                "type": ""
            }
        ],
        "screenShotFile": "005c00bd-000e-0049-00ee-00390068006a.png",
        "timestamp": 1585048074585,
        "duration": 10256
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11812,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048094822,
                "type": ""
            }
        ],
        "screenShotFile": "00520016-00f8-00ec-00d4-003d00a70068.png",
        "timestamp": 1585048085183,
        "duration": 9743
    },
    {
        "description": "should login to application fourthset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 11812,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Protractor.waitForAngular() - Locator: By(xpath, //div[@id='toast-container'])\n    at Driver.schedule (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048095414,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585048104879,
                "type": ""
            }
        ],
        "screenShotFile": "000a0040-008f-0037-0017-00b8002900f4.png",
        "timestamp": 1585048095291,
        "duration": 20620
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 11812,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(xpath, //button[contains(text(),'Browse Products')])\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)Error\n    at ElementArrayFinder.applyAction_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:459:27)\n    at ElementArrayFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:91:29)\n    at ElementFinder.<computed> [as getText] (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:831:22)\n    at C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:34:8\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048116545,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585048116547,
                "type": ""
            }
        ],
        "screenShotFile": "00d300ce-00a7-00b9-00b8-009c004b00ff.png",
        "timestamp": 1585048116343,
        "duration": 4447
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 292,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048291400,
                "type": ""
            }
        ],
        "screenShotFile": "001e0075-0069-009a-0005-005000e10007.png",
        "timestamp": 1585048264174,
        "duration": 27342
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 292,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048302020,
                "type": ""
            }
        ],
        "screenShotFile": "00580054-00f5-0050-00ce-0010003100a5.png",
        "timestamp": 1585048291933,
        "duration": 10196
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 292,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048302635,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048311964,
                "type": ""
            }
        ],
        "screenShotFile": "006500c2-005b-0061-0070-009d0091006c.png",
        "timestamp": 1585048302468,
        "duration": 9597
    },
    {
        "description": "should login to application fourthset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 292,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Protractor.waitForAngular() - Locator: By(xpath, //div[@id='toast-container'])\n    at Driver.schedule (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048312597,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048312597,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585048321813,
                "type": ""
            }
        ],
        "screenShotFile": "00be0020-00ec-0007-0055-0044005f00ca.png",
        "timestamp": 1585048312421,
        "duration": 20427
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 292,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048333538,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048333539,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585048333541,
                "type": ""
            }
        ],
        "screenShotFile": "00d4001d-0080-007d-00c8-00af0076008f.png",
        "timestamp": 1585048333268,
        "duration": 4722
    },
    {
        "description": "should login to application firstset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7464,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048579497,
                "type": ""
            }
        ],
        "screenShotFile": "004a001c-0048-0041-00ea-00b200b500b1.png",
        "timestamp": 1585048551664,
        "duration": 27930
    },
    {
        "description": "should login to application secondset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7464,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048589929,
                "type": ""
            }
        ],
        "screenShotFile": "00790068-00fd-00f8-0012-008000bc005f.png",
        "timestamp": 1585048579985,
        "duration": 10068
    },
    {
        "description": "should login to application thirdsset|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7464,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://auth.ordercloud.io/oauth/token - Failed to load resource: the server responded with a status of 400 (Bad Request)",
                "timestamp": 1585048599916,
                "type": ""
            }
        ],
        "screenShotFile": "00de0094-0074-00bd-006e-001d0037001a.png",
        "timestamp": 1585048590426,
        "duration": 9579
    },
    {
        "description": "should login to application fourthset|Test Login",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 7464,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": [
            "Failed: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)"
        ],
        "trace": [
            "ScriptTimeoutError: script timeout\n  (Session info: chrome=80.0.3987.149)\n  (Driver info: chromedriver=80.0.3987.106 (f68069574609230cf9b635cd784cfb1bf81bb53a-refs/branch-heads/3987@{#882}),platform=Windows NT 6.1.7601 SP1 x86_64)\n    at Object.checkLegacyResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\error.js:546:15)\n    at parseHttpResponse (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:509:13)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\http.js:441:30\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\nFrom: Task: Protractor.waitForAngular() - Locator: By(xpath, //div[@id='toast-container'])\n    at Driver.schedule (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\webdriver.js:807:17)\n    at ProtractorBrowser.executeAsyncScript_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:425:28)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\browser.js:456:33\n    at ManagedPromise.invokeCallback_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\nFrom: Task: Run afterEach in control flow\n    at UserContext.<anonymous> (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:94:19)\n    at attempt (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4297:26)\n    at QueueRunner.run (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4217:20)\n    at runNext (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4257:20)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4264:13\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4172:9\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasminewd2\\index.js:64:48\n    at ControlFlow.emit (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\events.js:62:21)\n    at ControlFlow.shutdown_ (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2674:10)\n    at C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2599:53\nFrom asynchronous test: \nError\n    at Suite.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:13:2)\n    at addSpecsToSuite (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1107:25)\n    at Env.describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:1074:7)\n    at describe (C:\\Users\\NareshS\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\jasmine-core\\lib\\jasmine-core\\jasmine.js:4399:18)\n    at Object.<anonymous> (C:\\Users\\NareshS\\eclipse-workspace\\protrract\\Mars_Byer\\demotest.js:5:1)\n    at Module._compile (internal/modules/cjs/loader.js:956:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:973:10)\n    at Module.load (internal/modules/cjs/loader.js:812:32)\n    at Function.Module._load (internal/modules/cjs/loader.js:724:14)"
        ],
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585048610023,
                "type": ""
            }
        ],
        "screenShotFile": "00be005f-00fa-006f-00de-008200490045.png",
        "timestamp": 1585048600371,
        "duration": 20683
    },
    {
        "description": "Verify Error Message|Test Login",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7464,
        "browser": {
            "name": "chrome",
            "version": "80.0.3987.149"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://archway-mars-qa.azurewebsites.net/main.d8c3ca245317190d8914.js 0 /deep/ combinator is no longer supported in CSS dynamic profile. It is now effectively no-op, acting as if it were a descendant combinator. /deep/ combinator will be removed, and will be invalid at M65. You should remove it. See https://www.chromestatus.com/features/4964279606312960 for more details.",
                "timestamp": 1585048621575,
                "type": ""
            }
        ],
        "screenShotFile": "00b400f9-00ab-0001-0067-004a000500e4.png",
        "timestamp": 1585048621454,
        "duration": 4420
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
