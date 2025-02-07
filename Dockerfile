FROM node:18 AS frontend-builder
WORKDIR /app/FE/tda25-fe
COPY FE/tda25-fe/package*.json ./
RUN npm install --force

# --force se používá kvůli react 19, jelikož ještě není plně podporován některými libraries


COPY FE/tda25-fe/ ./
RUN npm run build


FROM openjdk:21-jdk

WORKDIR /app


COPY BE/TdA25-BE/.mvn/ .mvn
COPY BE/TdA25-BE/mvnw BE/TdA25-BE/pom.xml BE/TdA25-BE/start.sh ./

RUN chmod +x ./mvnw
RUN ./mvnw dependency:resolve


COPY BE/TdA25-BE/src ./src


COPY --from=frontend-builder /app/FE/tda25-fe/out/. ./src/main/resources/static

ARG DATABASE_TOKEN
RUN echo "DATABASE_TOKEN=${DATABASE_TOKEN}" > .env


RUN chmod +x ./start.sh
EXPOSE 8080
CMD ["./start.sh"]
