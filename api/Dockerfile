FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY app.js .
COPY db.js .
CMD ["node", "app.js"]
