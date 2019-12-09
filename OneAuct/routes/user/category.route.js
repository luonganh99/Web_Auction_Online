const express = require('express');
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const router = express.Router();

router.get('/:id/products', async (req,res) => {
    var numProducts;
    for(const c of res.locals.lcCategories){
        if(c.CatID === +req.params.id) {
            numProducts = c.num_of_products;
        }
    }
    
    const products = await productModel.allbyCat(req.params.id);
    const category = await categoryModel.single(req.params.id);

    res.render('user/shop/allByCat', {
        title: 'Shop',
        style: 'shop_styles.css',
        style_responsive: 'shop_responsive.css',
        products: products,
        category: category[0],
        numProducts: numProducts,
        empty: products.length === 0
    });
});

module.exports = router;