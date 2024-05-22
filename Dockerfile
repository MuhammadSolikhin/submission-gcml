FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy only the application and node_modules
FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "start" ]

