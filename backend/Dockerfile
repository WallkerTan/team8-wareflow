# ---------- Stage 1: build ----------
# Dùng JDK 21 thuần; gradle wrapper (9.8.1) sẽ tự tải đúng version theo gradle-wrapper.properties
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy trước build files để tận dụng cache layer
COPY gradle/ gradle/
COPY gradlew gradlew
COPY settings.gradle build.gradle ./
COPY src/ src/

RUN chmod +x gradlew && ./gradlew bootJar --no-daemon -x test

# ---------- Stage 2: runtime ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo user non-root để bảo mật
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy jar từ stage build
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8081

# Healthcheck: chỉ coi là healthy khi API thực sự trả lời
HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=10 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8081/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
