// Android cordova-plugin-x-socialsharing needs this adding

//  <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application/receiver[@android:name='nl.xservices.plugins.ShareChooserPendingIntent']">
//    <activity android:exported="true" />
//  </edit-config>

// https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin/pull/1158

// iznik-nuxt-app\platforms\android\app\src\main\AndroidManifest.xml

var fs = require('fs');
var path = require('path');
var rootdir = "";
var manifestFile = path.join(rootdir, "platforms/android/app/src/main/AndroidManifest.xml");

fs.readFile(manifestFile, "utf8", function (err, data) {
  if (err)
    return console.log(err);

  var result = data;

  var addbefore = 'android:name="nl.xservices.plugins.ShareChooserPendingIntent"';
  var toadd = 'android:exported="true" ';
  result = result.replace(addbefore, toadd + addbefore);

  fs.writeFile(manifestFile, result, "utf8", function (err) {
    if (err)
      return console.log(err);
  });
});
