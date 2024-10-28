
FROM node:18 AS build


WORKDIR /src/app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


EXPOSE 3000

CMD ["npm", "start"]
