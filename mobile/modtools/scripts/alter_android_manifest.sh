#!/usr/bin/env sh

echo "- ALTER ANDROID MANIFEST TO REMOVE READ_MEDIA_VIDEO";

# remove line that '<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />'
sed -i '/READ_MEDIA_VIDEO/d' platforms/android/app/src/main/AndroidManifest.xml

#cat platforms/android/app/src/main/AndroidManifest.xml

exit
