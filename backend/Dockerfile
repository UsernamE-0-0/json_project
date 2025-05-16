FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем остальные файлы
COPY . .

# Открываем порты
EXPOSE 3000 8080

# Запускаем оба сервера
CMD ["sh", "-c", "node server_a.js & node server_u.js"]