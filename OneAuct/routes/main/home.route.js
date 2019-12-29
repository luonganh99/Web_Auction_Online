const express = require('express');
const productModel = require('../../models/product.model');
const config = require('../../config/default.json');
const limit = config.paginate.limit;


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

router.get('/search', async (req,res) => {
    const key = req.query.key;
    //Tao offset tu page request
    const page = req.query.page || 1;
    if(page < 1) page = 1;
    const offset = (page - 1) * limit;

    //Lay du lieu tu database
    const [totalProducts,products] = await Promise.all([
        productModel.countbySearch(key),
        productModel.pagebySearch(key,offset),
    ]);
    //Tong so trang
    let nPages = Math.floor(totalProducts/limit);
    if(totalProducts%limit > 0) nPages++;

    //Mang page de hient hien thi view
    const page_numbers = [];
    for(i = 1; i <= nPages; i++){
        page_numbers.push({
            value: i,
            isCurrent: i === +page
        })
    }

    //Tao nut bam
    let prev_value = +page - 1;
    let next_value = +page + 1;
    if(prev_value < 1) prev_value = 1;
    if(next_value > nPages) next_value = nPages;

    res.render('main/shop/search', {
        products,
        totalProducts,
        page_numbers,
        prev_value,
        next_value,
        empty: products.length === 0,
        key,
    });
});

module.exports = router;