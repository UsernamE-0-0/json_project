const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(bodyParser.json());

// Путь к файлу с данными о товарах
const productsFilePath = path.join(__dirname, 'products.json');

// Функция для чтения данных из файла
function readProductsFromFile() {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
}

// Функция для записи данных в файл
function writeProductsToFile(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
}

// Статические файлы (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend_admin')));

// Маршруты для API

// Получить список всех товаров
app.get('/api/products', (req, res) => {
    const products = readProductsFromFile();
    res.json(products);
});

// Добавить новый товар
app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    const products = readProductsFromFile();
    products.push(newProduct);
    writeProductsToFile(products);
    res.status(201).json(newProduct);
});

// Обновить товар по ID
app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    const products = readProductsFromFile();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = updatedProduct;
        writeProductsToFile(products);
        res.json(updatedProduct);
    } else {
        res.status(404).send('Product not found');
    }
});

// Удалить товар по ID
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    let products = readProductsFromFile();
    const initialLength = products.length;
    products = products.filter(p => p.id !== productId);
    if (products.length < initialLength) {
        writeProductsToFile(products);
        res.status(204).send();
    } else {
        res.status(404).send('Product not found');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Admin panel is running on http://localhost:${port}`);
});