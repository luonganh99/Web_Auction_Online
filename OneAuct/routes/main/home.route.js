const express = require('express');
const productModel = require('../../models/product.model');

const router = express.Router();

router.get('/', async (req,res) => {
    const [productByNumBid, productByTime, productByPrice] = await Promise.all([
        productModel.proByNumBid(),
        productModel.proByTime(),
        productModel.proByPrice()
    ]);
    res.render('main/home/home', {
        productByNumBid,
        productByTime,
        productByPrice
    });
});

module.exports = router;