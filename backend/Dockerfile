# Multi-stage Dockerfile for building and running the Spring Boot app (Java 21)
# Build stage: use Maven with a JDK
FROM maven:3-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy dependency descriptors first for better caching
COPY pom.xml ./
# Copy source
COPY src ./src

# Package the application (skip tests for faster image builds; remove -DskipTests to run tests)
RUN mvn -B -DskipTests package

# Run stage: use a lightweight JRE
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the packaged jar from the build stage; expects target/*.jar
COPY --from=build /workspace/target/*.jar app.jar

# Expose default Spring Boot port (adjust if your app uses a different port)
EXPOSE 8080

# Start the application
ENTRYPOINT ["java","-jar","/app/app.jar"]
