FROM node:alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm i --only=prod

# Copy rest of the source code
COPY . .

# Run start script
CMD ["npm", "start"]
