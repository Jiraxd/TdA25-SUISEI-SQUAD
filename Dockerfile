FROM node:18 AS frontend-builder
WORKDIR /app/FE/tda25-fe
COPY FE/tda25-fe/package*.json ./
RUN npm install
COPY FE/tda25-fe/ ./
RUN npm run build


FROM openjdk:21-jdk

WORKDIR /app


COPY BE/TdA25-BE/.mvn/ .mvn
COPY BE/TdA25-BE/mvnw BE/TdA25-BE/pom.xml BE/TdA25-BE/start.sh ./

RUN ./mvnw dependency:resolve


COPY BE/TdA25-BE/src ./src


COPY --from=frontend-builder /app/FE/tda25-fe/out/. ./src/main/resources/static


EXPOSE 8080
CMD ["./start.sh"]
