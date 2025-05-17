FROM node:18.20.7-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

# Comment out the build step to avoid rebuilding the app when the Dockerfile changes
# COPY . .
# RUN npm run build

EXPOSE 3000

CMD ["npx", "next", "dev"]
