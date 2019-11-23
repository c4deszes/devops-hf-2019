FROM node AS backend

#Installs backend dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

#Copies build output
COPY /dist ./dist
COPY /env ./env

EXPOSE 8080
CMD ["npm", "run", "start"]