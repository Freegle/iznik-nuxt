node ./node_modules/replace/bin/replace.js '\/js\/' 'js/' dist -r --quiet
node ./node_modules/replace/bin/replace.js 'https:\/\/apis.google.comjs\/platform.js' 'https://apis.google.com/js/platform.js' dist -r --quiet
node ./node_modules/replace/bin/replace.js 'adview.onlinejs' 'adview.online/js' dist -r --quiet
node ./node_modules/replace/bin/replace.js '"\/icons\/' '"icons/' dist -r --quiet
node ./node_modules/replace/bin/replace.js '"\/favicon.ico' '"favicon.ico' dist -r --quiet

node ./node_modules/replace/bin/replace.js '\/en-play-badge.png' 'en-play-badge.png' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/app-store-black-sm.png' 'app-store-black-sm.png' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/ebayvote.PNG' 'ebayvote.PNG' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/businesscards\/' 'businesscards/' dist -r --quiet

cd dist
rm -r councils
cd ..
