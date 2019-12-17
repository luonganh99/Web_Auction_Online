const express = require('express');
const wishlistModel = require('../../models/wishlist.model');
const productModel = require('../../models/product.model');
const router = express.Router();

router.get('/edit',  (req,res) => {
    res.render('user-categories/edit-account', {
        layout: 'user-categories',
    });
});


router.get('/auction',  (req,res) => {
    res.render('user-categories/auction', {
        layout: 'user-categories',
    });
});

router.get('/wishlist', async (req, res) => {
    const userID = 1;
    const products = await  wishlistModel.allbyUser(userID);

    console.log(products);
    res.render('user-categories/wishlist', {
        layout: 'user-categories',
        products
    });
});


module.exports = router;