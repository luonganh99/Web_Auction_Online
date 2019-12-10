const express = require('express');
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const router = express.Router();

router.get('/', async(req,res) => {
    const products = await productModel.all();
    const numProducts = await productModel.count();

    res.render('user/shop/all', {
        title: 'Shop',
        style: 'shop_styles.css',
        style_responsive: 'shop_responsive.css',
        products: products,
        nameCategory: 'Tất Cả Danh Mục',
        numProducts: numProducts[0].totalProducts,
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



module.exports = router;