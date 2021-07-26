FROM node:14

RUN npm install -g nodemon
RUN npm install -g pm2@latest

RUN mkdir -p /home/node/app
RUN chown -R node:node /home/node/app

USER node

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["pm2-runtime", "start", "pm2.config.js"]

