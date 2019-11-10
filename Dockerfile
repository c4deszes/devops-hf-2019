FROM node AS backend

#Installs backend dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

#Copies backend build output
COPY /dist ./dist
COPY /env ./env

FROM backend

#Copies React build output into the backend's public folder
COPY /build ./dist/public

EXPOSE 8080
CMD ["npm", "run", "start"]