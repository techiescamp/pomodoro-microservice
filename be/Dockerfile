# Stage 1: Build
FROM public.ecr.aws/docker/library/node:22.14.0-slim AS build
# Create app directory and set permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
# Copy application and public directory
COPY ./src/ /home/node/app
#RUN npm install --ignore-scripts
RUN npm install --production --frozen-lockfile
# Copy application and public directory
COPY ./src/ /home/node/app
# Change ownership of the files to the 'node' user and ensure proper permissions
#RUN chown -R node:node /home/node/app && chmod -R 755 /home/node/app
# Stage 2: Production
FROM public.ecr.aws/docker/library/node:22.14.0-slim AS runtime
WORKDIR /usr/src/app
USER node
# Copy built application from the build stage
COPY --from=build /home/node/app /usr/src/app
EXPOSE 7000
# Command to run the application (no npm in distroless)
CMD ["npm", "start"]
