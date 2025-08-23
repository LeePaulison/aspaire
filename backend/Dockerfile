FROM node:20-alpine3.19

# Update apk packages to reduce vulnerabilities
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# install only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
