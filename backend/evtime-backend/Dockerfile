# ---------- Build stage ----------
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy wrapper and build files first so dependency resolution is cached
# in its own layer and doesn't re-run on every source change.
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

# Warm the dependency cache. Failure here is tolerated (some Gradle
# versions error on a dependency-only run with no sources yet) — the
# real build below will still resolve anything missing.
RUN ./gradlew --no-daemon dependencies > /dev/null 2>&1 || true

COPY src src
RUN ./gradlew --no-daemon clean bootJar -x test

# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

RUN addgroup --system spring && adduser --system --ingroup spring spring

COPY --from=build /app/build/libs/*.jar app.jar
RUN mkdir -p /app/uploads && chown -R spring:spring /app

USER spring
EXPOSE 8080

# Container-aware JVM defaults (respects cgroup memory limits) —
# override JAVA_OPTS at runtime for tuning (e.g. -Xmx512m).
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
