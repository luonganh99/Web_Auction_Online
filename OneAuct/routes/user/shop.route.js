const express = require('express');
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const config = require('../../config/default.json');
const router = express.Router();

router.get('/', async(req,res) => {
    const limit = config.paginate.limit;

    //Tao offset tu page request
    const page = req.query.page || 1;
    if(page < 1) page = 1;
    const offset = (page - 1) * limit;

    //Lay du lieu database
    const [totalProducts, products] = await Promise.all([
        productModel.count(),
        productModel.page(offset)
    ]);

    //So trang nPages
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

    let prev_value = +page - 1;
    let next_value = +page + 1;
    if(prev_value < 1) prev_value = 1;
    if(next_value > nPages) next_value = nPages;

    res.render('user/shop/all', {
        title: 'Shop',
        style: 'shop_styles.css',
        style_responsive: 'shop_responsive.css',
        nameCategory: 'Tất Cả Danh Mục',
        products,
        totalProducts,
        page_numbers,
        prev_value,
        next_value,
        empty: products.length === 0
    });
});

router.get('/:id/products', async (req,res) => {
    var numProducts;
    for(const c of res.locals.lcCategories){
        if(c.CatID === +req.params.id) {
            numProducts = c.num_of_products;
        }
    }
    const products = await productModel.allbyCat(req.params.id);
    const categories = await categoryModel.single(req.params.id);

    res.render('user/shop/all', {
        title: 'Shop',
        style: 'shop_styles.css',
        style_responsive: 'shop_responsive.css',
        products: products,
        nameCategory: categories[0].CatName,
        numProducts: numProducts,
        empty: products.length === 0
    });
});

router.get('/:catID/products/:proID', async (req,res) => {
    const product = await productModel.single(req.params.proID);

    res.render('user/productsDetail', {
        title: 'Product Detail',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css',
        product: product[0]
    });
});

module.exports = router;