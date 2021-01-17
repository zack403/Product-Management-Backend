const express = require('express');
const router = express.Router();
const {Product, IsValid} = require('../models/product.model');
const {ProductVarieties} = require('../models/product_varieties.model');
const errorHandler = require('../helpers/errorHandler');
const successHandler = require('../helpers/successHandler');
const { uuid } = require('uuidv4');
const imageUpload = require('../helpers/imageUpload');
const deleteImage = require('../helpers/deleteImage');




let itemToSave = [];
let item = {};


//get all
router.get('/', async (req, res) => {
    const data = await Product.findAndCountAll({include: ProductVarieties, distinct: true, order: [['createdAt', 'DESC']]});
    return res.status(200).send(data);
});

//getby id
router.get('/:id', async (req, res) => {
    if(!req.params.id) return res.status(400).send(errorHandler(400, 'Missing id param'));

    const result = await Product.findByPk(req.params.id, {include: ProductVarieties});
    if(result === null) return res.status(404).send(errorHandler(404, 'not found'));

    return res.status(200).send(successHandler(200, result.dataValues));

})

router.post('/', upload.array('images', 10), async(req, res) => {

    if (req.files.length <= 0) return res.status(400).send(errorHandler(400, 'Upload atleast one image for this product.'));
    itemToSave = [];

    const {error} = IsValid(req.body);
    if (error) return res.status(400).send(errorHandler(400, error.message));


    if(req.body.product_varieties.length === 0) {
        return res.status(400).send(errorHandler(400, 'Invalid request. Missing product varieties.'));
    }

    try {

        let urls = [];
        
        for(const file of req.files) {
            const {path} = file;
            const result = await imageUpload(path);
            if(result) {
                urls.push(result.secure_url);
            }
            else {
                return res.status(500).send(errorHandler(500, "Error while trying to upload your image, try again..."));
            }
        }
    } catch (error) {
        return res.status(500).send(errorHandler(500, `Internal Server Error - ${error.message}`));
    }

    req.body.id = uuid();
    req.body.date_uploaded = new Date();

    try {

        for (const varieties of req.body.product_varieties) {
            item.ProductId = req.body.id;
            item.size = varieties.size;
            item.color = varieties.color;
            item.quantity = varieties.quantity;
            item.price = varieties.price;
            item.images = urls.join();
            itemToSave.push(item);
            item = {};
        }
        
        const isCreated = await Product.create(req.body);
        const varietiesAdded = await ProductVarieties.bulkCreate(itemToSave);
    
        if(isCreated && varietiesAdded) return res.status(201).send({status: 201, message: "Product saved."}); 

    } catch (error) {
        return res.status(500).send({status: 500, error: 'Error while saving product, please try again.'});
    }
    
});

router.patch('/:id', async(req, res) => {
    if(!req.params.id) return res.status(400).send(errorHandler(400, 'Missing id param'));

    try {
        req.body.date_edited = new Date();
        await Product.update(req.body, {where: { id: req.params.id }});

        for(const varieties of req.body.product_varieties) {
            await ProductVarieties.update(varieties, {where: {id: varieties.id}});
        }
        return res.status(200).send(successHandler(200, "Successfully updated"));
    } catch (error) {
        return res.status(400).send(errorHandler(400, "Unable to update"));        
    }        
   
})


router.delete('/:id', async({params: { id: productId } }, res) => {
    if(!productId) return res.status(400).send(errorHandler(400, 'Missing id param'));

    const deleted = await ProductVarieties.destroy({where: {ProductId: productId}});
    if(deleted == 1) return res.status(200).send(successHandler(200, "Varieties Successfully deleted"));

    return res.status(400).send(errorHandler(400, "Unable to delete"));


});

module.exports = router;