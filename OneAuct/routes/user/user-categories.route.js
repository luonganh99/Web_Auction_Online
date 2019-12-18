const express = require('express');
const wishlistModel = require('../../models/wishlist.model');
const productModel = require('../../models/product.model');
const bidModel = require('../../models/user-bid-product.model');
const userModel = require('../../models/user.model');
const router = express.Router();
const userID = 1;


router.get('/profile', async (req,res) => {
    const user = await userModel.single(userID);
    res.render('user-categories/profile', {
        layout: 'user-categories',
        user
    });
});

router.get('/password', (req,res) => {
    res.render('user-categories/password',{
        layout: 'user-categories',
    });
});

router.get('/edit', async (req,res) => {
    const user = await userModel.single(userID);
    res.render('user-categories/edit', {
        layout: 'user-categories',
        user
    });
});

router.post('/edit', async (req,res) => {
    //xử lý edit
});

router.get('/auction', async (req,res) => {
    res.render('user-categories/auction', {
        layout: 'user-categories',
    });
});

router.get('/wishlist', async (req, res) => {
    const products = await  wishlistModel.allbyUser(userID);

    console.log(products);
    res.render('user-categories/wishlist', {
        layout: 'user-categories',
        products
    });
});


module.exports = router;