const express = require('express');
require('express-async-errors');
const app = express();
const sequelize = require('./startup/database');
const winston = require('winston');
const config = require('config');
const {Product} = require('./models/product.model');
const {ProductVarieties} = require('./models/product_varieties.model');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require("./config/cloudinaryConfig");



// app.use(morgan('combined', { stream: winston.stream.write }));

app.use(morgan('combined'));



app.use(bodyParser.urlencoded({ extended: false }))




require('./models/product.model');
require('./models/product_varieties.model');
require('./startup/cors')(app);
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/production')(app);
require('./startup/logging')();


const port = process.env.PORT || config.get("port");
let server;

//model relationships
ProductVarieties.belongsTo(Product, {constraints: true, onDelete: 'CASCADE'})
Product.hasMany(ProductVarieties);



sequelize.sync({alter: {drop: false}}).then(s => {
    app.listen(port, () => winston.info(`Listening on port ${port}...`));
}).catch(e => {
    console.log(e);
});

module.exports = server;