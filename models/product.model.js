const { DataTypes } = require('sequelize');
const sequelize = require('../startup/database');
const Joi = require('@hapi/joi');


const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull : false,
        unique: true
    },
    product_description: {
        type: DataTypes.STRING,
        allowNull : false
    },
    date_uploaded: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_edited: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
{
    indexes: [
        {
            unique: false,
            fields: ['id', 'product_name']
        }
    ]
})

const validateProduct = product => {
    const schema =  Joi.object({
      product_name: Joi.string().required(),
      product_description: Joi.required(),
    })

    return schema.validate(product);
  }


  module.exports.Product = Product;
  module.exports.IsValid = validateProduct;