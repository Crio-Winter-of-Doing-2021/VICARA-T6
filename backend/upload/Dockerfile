FROM node:12.17.0-alpine as builder
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm i --only=production
RUN npm run build

# deploy built app
FROM node:12.17.0-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=builder /app/dist .
RUN npm i pm2 -g
EXPOSE 3000
CMD ["pm2", "start", "index.js"]
