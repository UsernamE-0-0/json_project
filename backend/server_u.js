const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
const port = 8080;

// GraphQL схема
const typeDefs = gql`
    type Product {
        id: ID!
        name: String!
        price: Float!
        description: String
        category: String
    }

    type Query {
        products: [Product]
    }
`;

// Загрузка товаров
function getProducts() {
    const data = fs.readFileSync(path.join(__dirname, 'products.json'));
    return JSON.parse(data);
}

// GraphQL resolvers
const resolvers = {
    Query: {
        products: () => getProducts()
    }
};

// Настройка Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    app.use(express.static(path.join(__dirname, '../frontend_user')));

    const httpServer = app.listen(port, () => {
        console.log(`
            Сервер пользователя успешно запущен!
            Доступные адреса:
            - Основной интерфейс: http://localhost:${port}
            - GraphQL API: http://localhost:${port}/graphql
            `);
    });

    // WebSocket сервер
    const wss = new WebSocket.Server({ server: httpServer });

    wss.on('connection', (ws) => {
        console.log('Новое подключение к чату');

        ws.on('message', (message) => {
            try {
                const msg = JSON.parse(message);
                // Рассылка всем клиентам
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
}

startServer();