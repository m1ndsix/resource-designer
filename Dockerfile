# syntax=docker/dockerfile:1

## multistage build script for voix services

## dev
FROM node:18-alpine3.15 AS develop

WORKDIR /app
COPY package*.json ./
RUN yarn install --production=false
RUN yarn global add @quasar/cli
COPY . .

## build
FROM develop as build-stage
RUN quasar build

## deploy
FROM nginx:latest as prod
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"]
