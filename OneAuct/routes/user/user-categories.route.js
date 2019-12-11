const express = require('express');
const router = express.Router();

router.get('/account',  (req,res) => {
    res.render('user-categories/account', {
        title: 'Account',
        layout: 'user-categories',
        style_specific: 'account.css',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css'
    });
});


router.get('/auction',  (req,res) => {
    res.render('user-categories/auction', {
        title: 'Auction',
        layout: 'user-categories',
        style_specific: 'auction.css',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css'
    });
});

router.get('/wishlist', (req, res) => {
    res.render('user-categories/wishlist', {
        title: 'Wish List',
        layout: 'user-categories',
        style_specific: 'wishlist.css',
        style: 'product_styles.css',
        style_responsive: 'product_responsive.css'
    });
});

module.exports = router;