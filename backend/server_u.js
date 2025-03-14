const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

// Путь к файлу с данными о товарах
const productsFilePath = path.join(__dirname, 'products.json');

// Функция для чтения данных из файла
function readProductsFromFile() {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
}

// Статические файлы (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend_user')));

// Маршрут для получения списка товаров
app.get('/api/products', (req, res) => {
    const products = readProductsFromFile();
    res.json(products);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`User interface is running on http://localhost:${port}`);
});