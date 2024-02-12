FROM node:20.11.0-alpine

RUN mkdir -p /usr/src/moecareapi
WORKDIR /usr/src/moecareapi

RUN apk update && apk upgrade
RUN apk add git

COPY package.json ./
COPY prisma ./prisma/

COPY . /usr/src/moecareapi/

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD ["npm","start"]