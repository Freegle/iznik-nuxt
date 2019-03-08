FROM node:11.5-alpine

RUN mkdir -p /usr/src/client-nuxt

WORKDIR /usr/src/client-nuxt

COPY package.json ./

RUN npm install

COPY . ./

CMD npm run dev
