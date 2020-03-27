#!/usr/bin/env sh

echo "- COPYING USER LOGO from icons";

mkdir www/images
cp icons/user_logo.png www/images

echo "- COPYING ICON FILES from icons/*/freegle.png";

#mkdir platforms/android/res/drawable
#cp icons/hdpi/freegle.png platforms/android/res/drawable-hdpi/icon.png
cp icons/hdpi/freegle.png platforms/android/app/src/main/res/drawable-hdpi/icon.png
#cp icons/mdpi/freegle.png platforms/android/res/drawable-mdpi/icon.png
cp icons/mdpi/freegle.png platforms/android/app/src/main/res/drawable-mdpi/icon.png
#cp icons/xhdpi/freegle.png platforms/android/res/drawable-xhdpi/icon.png
cp icons/xhdpi/freegle.png platforms/android/app/src/main/res/drawable-xhdpi/icon.png
#cp icons/xxhdpi/freegle.png platforms/android/res/drawable-xxhdpi/icon.png
mkdir platforms/android/app/src/main/res/drawable-xxhdpi
cp icons/xxhdpi/freegle.png platforms/android/app/src/main/res/drawable-xxhdpi/icon.png

exit