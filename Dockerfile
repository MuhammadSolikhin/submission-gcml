FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
ENV MODEL_URL=https://storage.googleapis.com/seraphic-ripple-424118-v7/model-in-prod/model.json
ENV GOOGLE_CLOUD_PROJECT=seraphic-ripple-424118-v7
EXPOSE 3000
CMD [ "npm", "run", "start" ]

