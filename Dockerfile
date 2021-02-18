FROM node:14-alpine

WORKDIR /app

ENV NODE_ENV local

ENV SCRAPPER_URL http://localhost:3000/api/scrape

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

CMD ["node", "./bin/www"]
