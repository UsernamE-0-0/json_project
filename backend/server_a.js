const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend_admin')));

// Путь к файлу с товарами
const productsPath = path.join(__dirname, 'products.json');

// REST API для товаров
app.get('/api/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath));
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath));
    const newProduct = { ...req.body, id: Date.now() };
    products.push(newProduct);
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

// Обновление товара
app.put('/api/products/:id', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath));
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;

    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Товар не найден' });
    }
});

  // Удаление товара
app.delete('/api/products/:id', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsPath));
    const productId = parseInt(req.params.id);

    const filteredProducts = products.filter(p => p.id !== productId);
    if (filteredProducts.length < products.length) {
      fs.writeFileSync(productsPath, JSON.stringify(filteredProducts, null, 2));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Товар не найден' });
    }
});

const httpServer = app.listen(port, () => {
    console.log(`
        Админ-панель успешно запущена!
        Доступные адреса:
        - Основной интерфейс: http://localhost:${port}
        - REST API: http://localhost:${port}/api/products
        `);
});

// WebSocket сервер
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', (ws) => {
    console.log('Новое подключение к админ-чату');

    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);
            // Рассылка сообщений всем клиентам
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(msg));
                }
            });
        } catch (err) {
            console.error('Ошибка обработки сообщения:', err);
        }
    });
});