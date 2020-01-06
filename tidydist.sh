node ./node_modules/replace/bin/replace.js '\/js\/' 'js/' dist -r --quiet
node ./node_modules/replace/bin/replace.js 'https:\/\/apis.google.comjs\/platform.js' 'https://apis.google.com/js/platform.js' dist -r --quiet
node ./node_modules/replace/bin/replace.js 'adview.onlinejs' 'adview.online/js' dist -r --quiet
node ./node_modules/replace/bin/replace.js '"\/icons\/' '"icons/' dist -r --quiet
node ./node_modules/replace/bin/replace.js '"\/favicon.ico' '"favicon.ico' dist -r --quiet

node ./node_modules/replace/bin/replace.js '\/en-play-badge.png' 'en-play-badge.png' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/app-store-black-sm.png' 'app-store-black-sm.png' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/ebayvote.PNG' 'ebayvote.PNG' dist -r --quiet
node ./node_modules/replace/bin/replace.js '\/businesscards\/' 'businesscards/' dist -r --quiet

node ./node_modules/replace/bin/replace.js '<\/body>' '<script type="text/javascript" src="cordova.js"></script></body>' dist/index.html --quiet

node ./node_modules/replace/bin/replace.js '<link data-n-head="1" rel="icon" type="image\/x-icon" href="favicon.ico">' '' dist/index.html --quiet
node ./node_modules/replace/bin/replace.js '<link data-n-head="1" rel="icon" type="image\/png" sizes="32x32" href="icons\/favicon-32x32.png">' '' dist/index.html --quiet
node ./node_modules/replace/bin/replace.js '<link data-n-head="1" rel="icon" type="image\/png" sizes="16x16" href="icons\/favicon-16x16.png">' '' dist/index.html --quiet
node ./node_modules/replace/bin/replace.js '<link data-n-head="1" rel="shortcut icon" href="icons\/favicon.ico">' '' dist/index.html --quiet

cd dist
rm -r councils
cd ..
