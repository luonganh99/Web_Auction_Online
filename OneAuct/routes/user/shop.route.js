const express = require('express');
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const userModel = require('../../models/user.model');
const bidModel = require('../../models/user-bid-product.model');
const config = require('../../config/default.json');
const moment = require('moment');
const router = express.Router();

const limit = config.paginate.limit;

router.get('/', async(req,res) => {
   
    //Tao offset tu page request
    const page = req.query.page || 1;
    if(page < 1) page = 1;
    const offset = (page - 1) * limit;

    //Lay du lieu database
    const [totalProducts, products] = await Promise.all([
        productModel.count(),
        productModel.page(offset)
    ]);

    //Tong so trang 
    let nPages = Math.floor(totalProducts/limit);
    if(totalProducts % limit > 0) nPages++; 
    
    //Mang page de hien thi view
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

    res.render('user/shop/all', {
        products,
        totalProducts,
        page_numbers,
        prev_value,
        next_value,
        nameCategory: 'Tất Cả Danh Mục',
        empty: products.length === 0
    });
});

router.get('/:id/products', async (req,res) => {

    // let numProducts;
    // for(const c of res.locals.lcCategories){
    //     if(c.CatID === +catID) {
    //         numProducts = c.num_of_products;
    //     }
    // }

    const catID = req.params.id;
    //Tao offset tu page request
    const page = req.query.page || 1;
    if(page < 1) page = 1;
    const offset = (page - 1) * limit;

    //Lay du lieu tu database
    const [totalProducts,products,categories] = await Promise.all([
        productModel.countbyCat(catID),
        productModel.pagebyCat(catID,offset),
        categoryModel.single(catID)
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
    res.render('user/shop/all', {
        products,
        totalProducts,
        page_numbers,
        prev_value,
        next_value,
        nameCategory: categories.CatName,
        empty: products.length === 0
    });
});

router.get('/:catID/products/:proID', async (req,res) => {
    const proID = req.params.proID;
    const catID = req.params.catID;
   
    const [product, category, seller, bidder, bidbyPro] = await Promise.all([
        productModel.single(proID),
        categoryModel.single(catID),
        userModel.seller(proID),
        userModel.bidder(proID),
        bidModel.bidbyPro(proID)
    ])
    
    //Xu ly cua view - de vao phan front-end
    let startDate = moment(product.StartDate);
    let expiryDate = moment(product.ExpiryDate);
    const diffDate = expiryDate.diff(startDate,'days');

    product.StartDate = startDate.format("DD-MM-YYYY");
    if(diffDate < 3) 
    {
        product.ExpiryDate = startDate.to(expiryDate);
    } else {
        product.ExpiryDate = expiryDate.format("DD-MM-YYYY");
    }
    
    res.render('user/productsDetail', {
        product,
        category,
        seller,
        bidder,
        bidbyPro
    });
});

router.post('/:catID/products/:proID/direct', async (req,res) => {
    const catID = req.params.catID;
    const proID = req.params.proID;


});

module.exports = router;