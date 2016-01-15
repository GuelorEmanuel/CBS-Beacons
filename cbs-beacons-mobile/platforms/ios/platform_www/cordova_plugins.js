cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-estimote/plugin/src/js/EstimoteBeacons.js",
        "id": "cordova-plugin-estimote.EstimoteBeacons",
        "pluginId": "cordova-plugin-estimote",
        "clobbers": [
            "estimote"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-estimote": "0.8.0",
    "cordova-plugin-whitelist": "1.2.0"
}
// BOTTOM OF METADATA
});