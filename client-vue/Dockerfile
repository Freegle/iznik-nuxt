FROM node:11.5-alpine

RUN mkdir -p /usr/src/client-vue

WORKDIR /usr/src/client-vue

COPY package.json ./

RUN yarn install

COPY . ./

CMD yarn dev
