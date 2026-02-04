FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "8000"]
