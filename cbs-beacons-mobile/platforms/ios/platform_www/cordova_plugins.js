cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "id": "cordova-plugin-console.console",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "id": "cordova-plugin-console.logger",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/ios/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-bluetooth-status/BluetoothStatus.js",
        "id": "cordova-plugin-bluetooth-status.BluetoothStatus",
        "pluginId": "cordova-plugin-bluetooth-status",
        "clobbers": [
            "cordova.plugins.BluetoothStatus"
        ]
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/lib/underscore-min-1.6.js",
        "id": "com.unarin.cordova.beacon.underscorejs",
        "pluginId": "com.unarin.cordova.beacon",
        "runs": true
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/lib/q.min.js",
        "id": "com.unarin.cordova.beacon.Q",
        "pluginId": "com.unarin.cordova.beacon",
        "runs": true
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/LocationManager.js",
        "id": "com.unarin.cordova.beacon.LocationManager",
        "pluginId": "com.unarin.cordova.beacon",
        "merges": [
            "cordova.plugins"
        ]
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/Delegate.js",
        "id": "com.unarin.cordova.beacon.Delegate",
        "pluginId": "com.unarin.cordova.beacon",
        "runs": true
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/model/Region.js",
        "id": "com.unarin.cordova.beacon.Region",
        "pluginId": "com.unarin.cordova.beacon",
        "runs": true
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/Regions.js",
        "id": "com.unarin.cordova.beacon.Regions",
        "pluginId": "com.unarin.cordova.beacon",
        "runs": true
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/model/CircularRegion.js",
        "id": "com.unarin.cordova.beacon.CircularRegion",
        "pluginId": "com.unarin.cordova.beacon",
        "runs": true
    },
    {
        "file": "plugins/com.unarin.cordova.beacon/www/model/BeaconRegion.js",
        "id": "com.unarin.cordova.beacon.BeaconRegion",
        "pluginId": "com.unarin.cordova.beacon",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-datepicker/www/ios/DatePicker.js",
        "id": "cordova-plugin-datepicker.DatePicker",
        "pluginId": "cordova-plugin-datepicker",
        "clobbers": [
            "datePicker"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-console": "1.0.2",
    "cordova-plugin-device": "1.1.0",
    "cordova-plugin-splashscreen": "3.0.0",
    "cordova-plugin-statusbar": "2.0.0",
    "cordova-plugin-whitelist": "1.2.0",
    "ionic-plugin-keyboard": "1.0.8",
    "cordova-plugin-network-information": "1.2.0",
    "cordova-plugin-bluetooth-status": "1.0.3",
    "com.unarin.cordova.beacon": "3.3.0",
    "cordova-plugin-datepicker": "0.9.2"
}
// BOTTOM OF METADATA
});