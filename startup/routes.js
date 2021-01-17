const express = require('express');
const product = require('../controllers/product.controller');

const errorHandler = require('../middlewares/error');

module.exports = app => {
  app.use(express.json());
  app.use('/api/v1/product', product)
  app.use(errorHandler);
}