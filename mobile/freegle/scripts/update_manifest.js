// Android cordova-plugin-contacts adds WRITE_CONTACTS unnecessarily, so remove
// https://stackoverflow.com/questions/25265908/cordova-remove-unnecessary-permissions
// iznik-nuxt-app\platforms\android\app\src\main\AndroidManifest.xml

// Android cordova-plugin-x-socialsharing needs this adding
//    android:exported="true"
// just before
//    android:name="nl.xservices.plugins.ShareChooserPendingIntent"
// if it does not already exist
// https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin/pull/1158

var permissionsToRemove = ["WRITE_CONTACTS"];

var fs = require('fs');
var path = require('path');
var rootdir = "";
var manifestFile = path.join(rootdir, "platforms/android/app/src/main/AndroidManifest.xml");

console.log("UPDATE MANIFEST")

fs.readFile(manifestFile, "utf8", function (err, data) {
  if (err)
    return console.log(err);

  var result = data;
  for (var i = 0; i < permissionsToRemove.length; i++) {
    result = result.replace("<uses-permission android:name=\"android.permission." + permissionsToRemove[i] + "\" />", "");
  }

  var addbefore = 'android:name="nl.xservices.plugins.ShareChooserPendingIntent"';
  var toadd = 'android:exported="true" ';
  if (result.indexOf(toadd + addbefore) == -1) {
    result = result.replace(addbefore, toadd + addbefore);
    console.log("UPDATE SHARE")
  }

  fs.writeFile(manifestFile, result, "utf8", function (err) {
    if (err)
      return console.log(err);
  });
});
