FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

# Запускаем vite preview с --host 0.0.0.0, чтобы слушать все интерфейсы
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
