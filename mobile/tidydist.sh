node ./node_modules/replace/bin/replace.js '\/js\/' 'js/' dist -r --quiet
node ./node_modules/replace/bin/replace.js 'https:\/\/apis.google.comjs\/platform.js' 'https://apis.google.com/js/platform.js' dist -r --quiet
node ./node_modules/replace/bin/replace.js 'adview.onlinejs' 'adview.online/js' dist -r --quiet
node ./node_modules/replace/bin/replace.js '"\/icons\/' '"icons/' dist -r --quiet

node ./node_modules/replace/bin/replace.js '\/mapmarker.gif' 'mapmarker.gif' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/en-play-badge.png' 'en-play-badge.png' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/app-store-black-sm.png' 'app-store-black-sm.png' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/ebayvote.PNG' 'ebayvote.PNG' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/businesscards\/' 'businesscards/' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/static\/' '' dist -r --quiet

node ./node_modules/replace/bin/replace.js '<\/body>' '<script type="text/javascript" src="cordova.js"></script></body>' dist/index.html --quiet

cd dist
rm -r councils
cd ..
