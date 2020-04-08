# Build phase
FROM node:13.12-alpine AS build

RUN apk add --update --no-cache python make g++ tini

WORKDIR /app
COPY ./package*.json ./

RUN npm set progress=false && npm config set depth 0
RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production


# Deployment phase
FROM node:13.12-alpine

EXPOSE 1337
WORKDIR /app

RUN apk add --update --no-cache tini
RUN npm set progress=false && npm config set depth 0

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/config config
COPY --from=build /app/assets assets
COPY --from=build /app/package.json package.json
COPY --from=build /app/package-lock.json package-lock.json

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "start"]
