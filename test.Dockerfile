FROM node:10-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

RUN yarn global add jest nodemon

COPY . .