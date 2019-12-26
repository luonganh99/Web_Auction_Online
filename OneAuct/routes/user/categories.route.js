const express = require('express');
const productModel = require('../../models/product.model');
const bidModel = require('../../models/user-bid-product.model');
const userModel = require('../../models/user.model');
const categoryModel = require('../../models/category.model');
const multer = require('multer');

// const storage = multer.diskStorage({
//     filename: function(req,file,cb){
//         cb(null, file.originalname);
//     },
//     destination: function(req,file,cb){
//         cb(null, `./public/images/product`);
//     }
// })
// const upload = multer({storage});
const router = express.Router();


router.get('/profile', async (req,res) => {
    const user = await userModel.single(req.session.authUser.UserID);
    res.render('user/profile', {
        layout: 'user',
        user
    });
});

router.get('/edit', async (req,res) => {
    const user = await userModel.single(req.session.authUser.UserID);
    res.render('user/edit', {
        layout: 'user',
        user
    });
});

router.post('/edit', async (req,res) => {
    //xử lý edit
});

router.get('/password', (req,res) => {
    res.render('user/password',{
        layout: 'user',
    });
});

router.post('/password', (req,res) => {

});

router.get('/post', (req,res) => {
    res.render('user/post', {
        layout: 'user'
    });
});

const storage = multer.diskStorage({
    filename: function(req,file,cb){
        cb(null, file.originalname);
    },
    destination: function(req,file,cb){
        cb(null, `./public/images/product`);
    },
});
const upload = multer({storage});

router.post('/post', (req,res) => {
    upload.array('Images')(req, res, err => {
        if (err) {

        }
        console.log(req.body);
    })
   console.log(req.body); 
   res.send('done');
});

router.get('/joininglist', async(req,res) => {
    const products = await productModel.joininglist(req.session.authUser.UserID);
    res.render('user/joiningList', {
        layout: 'user',
        products
    });
});

router.get('/joinedlist', async(req,res) => {
    const products = await productModel.joinedlist(req.session.authUser.UserID);
    res.render('user/joinedList', {
        layout: 'user',
        products
    });
});

router.get('/wonlist', async(req,res) => {
    const products = await productModel.wonlist(req.session.authUser.UserID);
    res.render('user/wonList', {
        layout: 'user',
        products
    });
});

router.get('/wishlist', async (req, res) => {
    const products = await productModel.wishlist(req.session.authUser.UserID);
    res.render('user/wishList', {
        layout: 'user',
        products
    });
});

module.exports = router;