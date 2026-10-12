# ---- Stage 1: Build ----
# Use the official Maven image that bundles Maven + Java 21 JDK together
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies layer separately (re-downloads only if pom.xml changes)
