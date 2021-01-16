const { DataTypes } = require('sequelize');
const sequelize = require('../startup/database');
const Joi = require('@hapi/joi');


const ProductVarieties = sequelize.define('ProductVarieties', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    size: {
        type: DataTypes.STRING,
        allowNull : false
    },
    color: {
        type: DataTypes.STRING,
        allowNull : false
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    images: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const validateProductVarieties = product => {
    const schema =  Joi.object({
      size: Joi.string().required(),
      color: Joi.required(),
      quantity: Joi.required(),
      price: Joi.required()
    })

    return schema.validate(product);
  }


  module.exports.ProductVarieties = ProductVarieties;
  module.exports.IsValid = validateProductVarieties;