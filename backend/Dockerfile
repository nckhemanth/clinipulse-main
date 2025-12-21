FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN ./mvnw -q -DskipTests dependency:go-offline
COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S clinipulse && adduser -S clinipulse -G clinipulse
COPY --from=build /workspace/target/clinipulse-api-0.0.1-SNAPSHOT.jar app.jar
USER clinipulse
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
