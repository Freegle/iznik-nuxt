FROM node:14-alpine3.15

WORKDIR /app

ENV IZNIK_API=http://apiv1 \
	API=http://apiv1/api

RUN apk update && apk add git python2 \
    && git clone https://github.com/Freegle/iznik-nuxt.git

CMD cd iznik-nuxt \
    && git pull \
    && yes | npm install -y --legacy-peer-deps \
    && export NODE_OPTIONS=--max-old-space-size=8192;export HOST=0; npm run dev
