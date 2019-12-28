const express = require('express');
const productModel = require('../../models/product.model');
const bidModel = require('../../models/user-bid-product.model');
const userModel = require('../../models/user.model');
const categoryModel = require('../../models/category.model');
const rateModel = require('../../models/user-rate-user.model');
const upgradeModel = require('../../models/users-upgrade-sellers.model');
const restrictSeller = require('../../middlewares/authSeller.mdw');
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

router.get('/post', restrictSeller,  (req,res) => {
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

router.post('/post', restrictSeller, (req,res) => {
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

router.get('/review', async (req,res) => {
    const [rates, goodRate, badRate] = await Promise.all([
        productModel.reviewlist(req.session.authUser.UserID),
        rateModel.goodReview(req.session.authUser.UserID),
        rateModel.badReview(req.session.authUser.UserID)
    ]);
    //Tính phần trăm điểm đánh giá
    const checkRate = goodRate / (goodRate + badRate);
    let check = true;
    if(checkRate < 0.8){
        check = false;
    }
    res.render('user/review', {
        layout: 'user',
        rates,
        goodRate,
        badRate,
        check
    });
});

router.get('/upgrade', (req,res) => {
    res.render('user/upgrade', {
        layout: 'user'
    })
})

router.get('/postupgrade', async (req,res) => {
    //Cập nhật bảng upgrade
    const entity = {
        UserID: req.session.authUser.UserID,
        Username: req.session.authUser.Username
    }
    const results = await upgradeModel.add(entity);
    res.render('user/upgrade', {
        layout: 'user',
        upgrade: true
    });
});


module.exports = router;