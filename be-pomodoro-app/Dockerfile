# Stage 1: Build
FROM public.ecr.aws/docker/library/node:22.14.0-slim AS build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ["./package*.json", "/home/node/app"]
RUN npm install --production --frozen-lockfile
COPY ./src/ /home/node/app
# Stage 2: Runtime
FROM public.ecr.aws/docker/library/node:22.14.0-slim AS runtime
WORKDIR /usr/src/app
USER node
COPY --from=build /home/node/app /usr/src/app
EXPOSE 7000
CMD ["npm", "start"]
