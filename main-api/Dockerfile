FROM node:lts-alpine

RUN apk --no-cache --update add imagemagick
RUN mkdir -p /usr/src/files

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
