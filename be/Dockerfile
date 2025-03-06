# Stage 1: Build
FROM public.ecr.aws/docker/library/node:22.14.0-slim AS build
# Create app directory and set permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
# Copy package.json and install dependencies
COPY ["./src/package.json", "./src/package-lock.json", "/home/node/app"]
# Change ownership of the files to the 'node' user and ensure proper permissions
RUN chown -R node:node /home/node/app
RUN chmod -R 755 /home/node/app
USER node
RUN npm install --ignore-scripts
# Copy application and public directory
COPY ./src/ /home/node/app

# Stage 2: Production
FROM gcr.io/distroless/nodejs22-debian12:nonroot
# Copy built application from the build stage
COPY --from=build /home/node/app /usr/src/app
USER nonroot
EXPOSE 7000
WORKDIR /usr/src/app
# Command to run the application
CMD ["npm", "start"]

