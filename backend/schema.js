const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLInt } = require('graphql');

// Тип для товара
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        price: { type: GraphQLInt },
        description: { type: GraphQLString },
        category: { type: GraphQLString }
    }
});

// Корневой запрос
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        products: {
            type: new GraphQLList(ProductType),
            args: {
                fields: { type: GraphQLString } // Поля, которые нужно вернуть
            },
            resolve(parent, args) {
                const products = require('./products.json');
                if (args.fields) {
                    return products.map(product => {
                        const fields = args.fields.split(',');
                        const result = {};
                        fields.forEach(field => {
                            if (product[field]) {
                                result[field] = product[field];
                            }
                        });
                        return result;
                    });
                }
                return products;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});