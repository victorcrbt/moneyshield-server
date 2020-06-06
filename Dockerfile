FROM node:12.16.2-alpine

WORKDIR /usr/app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "run", "start"]