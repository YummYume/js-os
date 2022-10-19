FROM node:18.0.0-alpine

WORKDIR /home/node

USER node

COPY package.json yarn.lock ./

RUN yarn install

CMD [ "yarn", "start" ]
