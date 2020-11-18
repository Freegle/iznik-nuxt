// Android cordova-plugin-contacts adds WRITE_CONTACTS unnecessarily, so remove
// https://stackoverflow.com/questions/25265908/cordova-remove-unnecessary-permissions
// D:\FreeglePenrithEden\iznik-nuxt-app\platforms\android\app\src\main\AndroidManifest.xml

var permissionsToRemove = ["WRITE_CONTACTS"];

var fs = require('fs');
var path = require('path');
var rootdir = "";
var manifestFile = path.join(rootdir, "platforms/android/app/src/main/AndroidManifest.xml");

fs.readFile(manifestFile, "utf8", function (err, data) {
  if (err)
    return console.log(err);

  var result = data;
  for (var i = 0; i < permissionsToRemove.length; i++)
    result = result.replace("<uses-permission android:name=\"android.permission." + permissionsToRemove[i] + "\" />", "");

  fs.writeFile(manifestFile, result, "utf8", function (err) {
    if (err)
      return console.log(err);
  });
});
