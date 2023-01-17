#!/bin/sh
set -x #echo on

# Create a custom keychain
security create-keychain -p circleci ios-build.keychain

# Make the custom keychain default, so xcodebuild will use it for signing
security default-keychain -s ios-build.keychain

# Unlock the keychain
security unlock-keychain -p circleci ios-build.keychain

# Added: unlock default keychain https://stackoverflow.com/questions/46295291/allowprovisioningupdates-doesnt-work/47076629#47076629
# security unlock-keychain ~/Library/Keychains/login.keychain-db

# Set keychain timeout to 1 hour for long builds
# see http://www.egeek.me/2013/02/23/jenkins-and-xcode-user-interaction-is-not-allowed/
security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

# Add certificates to keychain and allow codesign to access them. Apple cert from https://www.apple.com/certificateauthority/
security import mobile/AppleWWDRCAG3.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign -T /usr/bin/xcrun
security import mobile/secrets/FreegleLtd-exp-2023-12-30.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign -T /usr/bin/xcrun
security import mobile/secrets/FreegleLtd-exp-2023-12-30.p12 -k ~/Library/Keychains/ios-build.keychain -P $iossignkey -T /usr/bin/codesign -T /usr/bin/xcrun

# https://stackoverflow.com/a/40870033/1972627
security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k circleci ios-build.keychain

# Put the provisioning profile in place
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp mobile/secrets/*.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
ls -l ~/Library/MobileDevice/Provisioning\ Profiles
