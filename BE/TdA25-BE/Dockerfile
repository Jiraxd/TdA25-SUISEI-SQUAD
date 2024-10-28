FROM openjdk:20-jdk-buster

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:resolve

COPY src ./src

EXPOSE 80

CMD ["./start.sh"]