
FROM maven:latest AS build


WORKDIR /app


COPY pom.xml .
COPY src ./src
RUN mvn clean package

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
