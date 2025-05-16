FROM nginx:alpine

# Удаляем дефолтные файлы Nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем наши файлы
COPY . /usr/share/nginx/html

# Открываем порт 80 (Nginx)
EXPOSE 80