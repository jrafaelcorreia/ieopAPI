const entitiesRouter = require('express').Router();
const costomers = require('../controllers/costomers');
const products = require('../controllers/products');
const orders = require('../controllers/orders');

entitiesRouter.get('/costumers', costomers.get);
entitiesRouter.get('/costumers/:id', costomers.getById);
entitiesRouter.post('/createClient', costomers.create);

entitiesRouter.get('/products', products.get);
entitiesRouter.get('/products/:id', products.getById);
entitiesRouter.post('/createProduct', products.create);

entitiesRouter.get('/orders', orders.get);
entitiesRouter.get('/orders/:id', orders.getById);
entitiesRouter.post('/createOrders', orders.create);


module.exports = entitiesRouter;