FROM node: 14
WORKDIR /usr/src/app
COPY package*.json app.js ./
RUN npm install
EXPOSE 9000
CMD ["node", "app.js"]
