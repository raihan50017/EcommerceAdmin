# Base image for building
FROM node:lts-alpine AS builder

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

ENV TSC_COMPILE_ON_ERROR true
RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
